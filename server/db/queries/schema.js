import { buildSchema } from 'graphql'
import {
  ContactController as Contact,
  PhotographerController as Photographer,
  UserController as User
} from '../controllers'

export const root = {
  createProject: (args, req) => {},
  getMe: (_, req) => User.get({id: req.user.id}),
  getUser: (query) => User.get(query),
  User: (query) => User.get(query),
  updateMe: (args, req) => User.update({id: req.user.id}, args.updates),
  updatePhotographerMe: (args, req) => Photographer.update({id: req.user.id}, args.updates),
  updateContactMe: (args, req) => Contact.update({id: req.user.id}, args.updates)
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
    updatePhotographerMe(updates: PhotographerInput): Photographer
    updateContactMe(updates: ContactInput): Contact

    createProject(project: ProjectInput): Project
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
    id: Int!
    name: String!
  }

  # Additional fields for Nonprofit Contact users
  type Contact {
    phoneSecondary: String
    phoneSecondaryType: String
  }

  # Additional Fields for Storyteller users
  type Photographer {
    userId: String
    instagram: String
    cameraPhone: Boolean
    cameraFilm: Boolean
    cameraDSLR: Boolean
    cameraOther: String
    preferredContactMethod: String
    causes: [Cause]
    availabilities: [String]
  }

  # Description of a Nonprofit's project
  type Project {
    id: String!
    name: String!
    description: String!
    date: String!
    dateIsApprox: Boolean!
    location: String
    status: String
    photoLink: String
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
    availabilities: [String]
  }

  input ProjectInput {
    name: String
    description: String
    nonprofitId: String
    date: String
    state: String
  }
`

export const schema = buildSchema(types + inputs + queries + mutations)
