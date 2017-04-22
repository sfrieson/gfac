import { buildSchema } from 'graphql';
import UserController from '../controllers/user';
import { User as UserModel, Photographer as PhotoModel } from '../models'

export const root = {
  getMe: (_, req) => UserController.get({id: req.user.id}),
  getUser: (query) => UserController.get(query),
  User: (query) => UserController.get(query),
  updateMe: (args, req) => UserController.update({id: req.user.id}, args.updates)
};
root.getMePhotographer = root.getMe;
root.getMeContact = root.getMe;

export const schema = buildSchema(`
  type Admin {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }
  
  type Cause {
    name: String!
    id: Int!
  }
  type Contact {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }
  
  type Photographer {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
    instagram: String
    cameraPhone: Boolean
    cameraFilm: Boolean
    cameraDSLR: Boolean
    cameraOther: String
    preferredContactMethod: String
    causes: [Cause]
  }
  
  ${' '/* Unnecessary? */}
  type User {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }
  
  input UserInput {
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }
  
  type Query {
    getMeContact: Contact
    getMePhotographer: Photographer 
    getMe: User
    getUser(id: String, email: String): User
  }
  
  type Mutation {
    updateMe(updates: UserInput): User
  }
  
`);
