import { buildSchema } from 'graphql'
import {
  ContactController as Contact,
  NonprofitController as Nonprofit,
  PhotographerController as Photographer,
  UserController as User,
  ProjectController as Project
} from '../controllers'

const queryResolvers = {
  getMe: (_, req) => User.get({id: req.user.id}),
  getPhotographer: (args) => User.get({id: args.userId}),
  getProjects: (args, { user }) => Project.get(args, user),
  getUser: (query) => User.get(query),
  search: (args) => User.search(args.queries)
}
queryResolvers.getMePhotographer = queryResolvers.getMe
queryResolvers.getMeContact = queryResolvers.getMe

const mutationResolvers = {
  createProject: (args) => Project.create(args.project),
  updateContactMe: (args, req) => Contact.update({id: req.user.id}, args.updates),
  updateMe: (args, req) => User.update({id: req.user.id}, args.updates),
  updateNonprofit: ({id, updates}) => Nonprofit.update(id, updates),
  updateProject: ({id, updates}) => Project.update(id, updates),
  updatePhotographerMe: (args, req) => Photographer.update({id: req.user.id}, args.updates)
}

export const root = {...queryResolvers, ...mutationResolvers}

const queries = `
  type Query {
    getMeContact: Contact
    getMePhotographer: Photographer
    getMe: User
    getPhotographer (userId: String): Photographer
    getProjects(nonprofitId: String): [Project]
    getUser(id: String, email: String): AnyUser
    search(queries: SearchQueries): [Photographer]
  }
`

const mutations = `
  type Mutation {
    createProject(project: ProjectInput): Project
    updateContactMe(updates: ContactInput): Contact
    updateMe(updates: UserInput): AnyUser
    updateNonprofit(id: String, updates: NonprofitInput): Nonprofit
    updateProject(id: Int, updates: ProjectInput): Project
    updatePhotographerMe(updates: PhotographerInput): Photographer
  }
`

const types = `
  # Additional fields for Admin users
  type Admin implements UserInterface {
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
  type Contact implements UserInterface {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
    nonprofit: Nonprofit
    phoneSecondary: String
    phoneSecondaryType: String
  }

  # Fields describing a Nonprofit
  type Nonprofit {
    id: String
    name: String
    description: String
  }

  # Additional Fields for Storyteller users
  type Photographer implements UserInterface {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
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
    nonprofitId: String!
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

  union AnyUser = Admin | Contact | Photographer

  interface UserInterface {
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
    dateIsApprox: String
    location: String
  }

  input NonprofitInput {
    name: String
    description: String
  }

  input SearchQueries {
    firstname: String
    lastname: String
    instagram: String
    role: String
    cameraDSLR: Boolean
    cameraPhone: Boolean
    cameraFilm: Boolean
  }

  input UserInput {
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }
`

export const schema = buildSchema(types + inputs + queries + mutations)
