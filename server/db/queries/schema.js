import { buildSchema } from 'graphql'
import UserController from '../controllers/user'
import { Contact as ContactModel, Photographer as PhotoModel } from '../models'

export const root = {
  getMe: (_, req) => UserController.get({id: req.user.id}),
  getMeContact: (_, req) => {
    if (req.user.role === 'contact') {
      ContactModel.get({id: req.user.id}).then(contact => contact.get())
    } else return Promise.resolve({})
  },
  getMePhotographer: (_, req) => {
    if (req.user.role === 'photographer') {
      PhotoModel.get({id: req.user.id}).then(photographer => photographer.get())
    } else return Promise.resolve({})
  },
  getUser: (query) => UserController.get(query),
  User: (query) => UserController.get(query),
  updateMe: (args, req) => UserController.update({id: req.user.id}, args.updates)
}
root.getMePhotographer = root.getMe
root.getMeContact = root.getMe

const queries = `
  type Query {
    getMeContact: Contact
    getMePhotographer: Photographer
    getMe: User
    getUser(id: String, email: String): User
  }
`

const mutations = `
  type Mutation {
    updateMe(updates: UserInput): User
  }
`

const types = `
  # Additional fields for Admin users
  type Admin {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }

  # Causes for Interests and Focuses
  type Cause {
    name: String!
    id: Int!
  }

  # Additional fields for Nonprofit Contact users
  type Contact {
    phoneSecondary: String
    phoneSecondaryType: String
  }

  # Additional Fields for Storyteller users
  type Photographer {
    instagram: String
    cameraPhone: Boolean
    cameraFilm: Boolean
    cameraDSLR: Boolean
    cameraOther: String
    preferredContactMethod: String
    causes: [Cause]
  }

  # Base fields for all users
  type User {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }
`

const inputs = `
  input UserInput {
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }

  input ContactInput {
    phoneSecondary: String
    phoneSecondaryType: String
  }

  input PhotographerInput {
    instagram: String
    cameraPhone: Boolean
    cameraFilm: Boolean
    cameraDSLR: Boolean
    cameraOther: String
    preferredContactMethod: String
    causes: [Int]
  }
`

export const schema = buildSchema(types + inputs + queries + mutations)
