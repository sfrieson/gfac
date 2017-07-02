import elasticLunr from 'elasticlunr'
import {
  // ContactController,
  // NonprofitController,
  PhotographerController
  // ProjectController,
  // UserController
} from '../controllers'

const fields = [
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

const idx = elasticLunr(function () {
  this.setRef('id')
  fields.forEach(field => this.addField(field))

  PhotographerController.getAll()
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
      causes: p.causes.map(({id}) => 'cause-' + id)
    }
  }))
  .then(photographers => photographers.map(p => this.addDoc(p)))
})

export function photographer (term) {
  return Promise.resolve(
    idx.search(term)
    .map(({ref}) => idx.documentStore.getDoc(ref))
  )
}
