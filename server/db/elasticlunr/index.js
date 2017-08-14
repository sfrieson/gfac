import elasticLunr from 'elasticlunr'
import {
  // ContactController,
  NonprofitController,
  StorytellerController
  // ProjectController,
  // UserController
} from '../controllers'

const storytellerFields = [
  'email',
  'firstname',
  'lastname',
  'phone',
  'availabilities',
  'camera',
  'causes',
  'instagram',
  'portfolio'
]

export function formatStorytellerForIndex (s) {
  const camera = []
  if (s.cameraFilm) camera.push('film')
  if (s.cameraDSLR) camera.push('DSLR')
  if (s.cameraPhone) camera.push('phone')
  if (s.cameraOther) camera.push(s.cameraOther)
  return {
    ...s,
    camera,
    availabilities: s.availabilities.map(({day, time}) => `${day}_${time}`),
    causes: s.causes.map(({id}) => 'cause_' + id)
  }
}

export let storytellerIdx
function buildStorytellerIndex () {
  storytellerIdx = elasticLunr(function () {
    this.setRef('id')
    storytellerFields.forEach(field => this.addField(field))
  })

  return StorytellerController.getAll()
  .then(storytellers => storytellers.map(formatStorytellerForIndex))
  .then(storytellers => storytellers.map(s => storytellerIdx.addDoc(s)))
}

const nonprofitFields = [
  'name',
  'description',
  'contacts',
  'projects',
  'causes'
]

export let nonprofitIdx
function buildNonprofitIndex () {
  nonprofitIdx = elasticLunr(function () {
    this.setRef('id')
    nonprofitFields.forEach(field => this.addField(field))
  })

  return NonprofitController.getAll()
  .then(storytellers => storytellers.map((s) => {
    return {
      ...s,
      contacts: s.contacts.map(({firstname, lastname}) => `${firstname} ${lastname}`),
      projects: s.projects.map(({name}) => name),
      causes: s.causes.map(({id}) => 'cause_' + id)
    }
  }))
  .then(storytellers => storytellers.map(p => nonprofitIdx.addDoc(p)))
}

export function search (term, type) {
  const idx = type === 'storyteller' ? storytellerIdx : nonprofitIdx
  return Promise.resolve(
    idx.search(term)
    .map(({ref}) => idx.documentStore.getDoc(ref))
  )
}

export function bulkIndex () {
  return Promise.all([
    buildNonprofitIndex(),
    buildStorytellerIndex()
  ])
}
