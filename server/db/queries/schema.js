import { buildSchema } from 'graphql';
import UserController from '../controllers/user';

export const root = {
  getMe: (_, req) => UserController.get({id: req.user.id}),
  getUser: (query) => UserController.get(query),
  User: (query) => UserController.get(query)
};

export const schema = buildSchema(`
  type User {
    id: String
    email: String
    firstname: String
    lastname: String
    phone: String
    phoneType: String
    role: String
  }
  
  type Query {
    getMe: User
    getUser(id: String, email: String): User
  }
`);