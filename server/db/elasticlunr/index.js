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

let storytellerIdx
function buildStorytellerIndex () {
  storytellerIdx = elasticLunr(function () {
    this.setRef('id')
    storytellerFields.forEach(field => this.addField(field))
  })

  return StorytellerController.getAll()
  .then(storytellers => storytellers.map((p) => {
    const camera = []
    if (p.cameraFilm) camera.push('film')
    if (p.cameraDSLR) camera.push('DSLR')
    if (p.cameraPhone) camera.push('phone')
    if (p.cameraOther) camera.push(p.cameraOther)

    return {
      ...p,
      camera,
      availabilities: p.availabilities.map(({day, time}) => `${day}_${time}`),
      causes: p.causes.map(({id}) => 'cause_' + id)
    }
  }))
  .then(storytellers => storytellers.map(p => storytellerIdx.addDoc(p)))
}

const nonprofitFields = [
  'name',
  'description',
  'contacts',
  'projects',
  'causes'
]

let nonprofitIdx
function buildNonprofitIndex () {
  nonprofitIdx = elasticLunr(function () {
    this.setRef('id')
    nonprofitFields.forEach(field => this.addField(field))
  })

  return NonprofitController.getAll()
  .then(storytellers => storytellers.map((p) => {
    return {
      ...p,
      contacts: p.contacts.map(({firstname, lastname}) => `${firstname} ${lastname}`),
      projects: p.projects.map(({name}) => name),
      causes: p.causes.map(({id}) => 'cause_' + id)
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
