import elasticLunr from 'elasticlunr'
import {
  // ContactController,
  NonprofitController,
  PhotographerController
  // ProjectController,
  // UserController
} from '../controllers'

const photographerFields = [
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

let photographerIdx
function buildPhotographerIndex () {
  photographerIdx = elasticLunr(function () {
    this.setRef('id')
    photographerFields.forEach(field => this.addField(field))
  })

  return PhotographerController.getAll()
  .then(photographers => photographers.map((p) => {
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
  .then(photographers => photographers.map(p => photographerIdx.addDoc(p)))
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
  .then(photographers => photographers.map((p) => {
    return {
      ...p,
      contacts: p.contacts.map(({firstname, lastname}) => `${firstname} ${lastname}`),
      projects: p.projects.map(({name}) => name),
      causes: p.causes.map(({id}) => 'cause_' + id)
    }
  }))
  .then(photographers => photographers.map(p => nonprofitIdx.addDoc(p)))
}

export function search (term, type) {
  const idx = type === 'storyteller' ? photographerIdx : nonprofitIdx
  return Promise.resolve(
    idx.search(term)
    .map(({ref}) => idx.documentStore.getDoc(ref))
  )
}

export function bulkIndex () {
  return Promise.all([
    buildNonprofitIndex(),
    buildPhotographerIndex()
  ])
}
