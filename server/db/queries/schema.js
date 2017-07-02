import {
  GraphQLBoolean as Bool,
  // GraphQLEnumType as Enum,
  GraphQLID as Id,
  GraphQLInt as Int,
  GraphQLInputObjectType as Input,
  GraphQLInterfaceType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as Type,
  GraphQLSchema,
  GraphQLString as Str
} from 'graphql'

import {
  ContactController as ContactC,
  NonprofitController as NonprofitC,
  PhotographerController as PhotographerC,
  UserController as UserC,
  ProjectController as ProjectC
} from '../controllers'

import search from '../elasticlunr'

const userFields = {
  id: {type: new NonNull(Id)},
  email: {type: Str},
  firstname: {type: Str},
  lastname: {type: Str},
  phone: {type: Str},
  // TODO Change to enum
  phoneType: {type: Str},
  role: {type: Str}
}
const User = new GraphQLInterfaceType({
  name: 'UserInterface',
  description: 'Base fields of all users.',
  fields: userFields,
  resolveType: (user) => {
    if ('role' in user) {
      switch (user.role) {
        case 'admin':
          return Admin
        case 'contact':
          return Contact
        case 'photographer':
          return Photographer
      }
    } else {
      if (user.nonprofit) return Contact
      if (user.instagram) return Photographer
      if (!user.nonprofit && !user.instagram) return Admin
    }
  }
})

// *****
// Types
// *****

const Admin = new Type({
  name: 'Admin',
  fields: {
    ...userFields,
    userId: {type: Str}
  },
  interfaces: [User]
})

const Cause = new Type({
  name: 'Cause',
  fields: {
    id: {type: new NonNull(Int)},
    name: {type: new NonNull(Str)}
  }
})

const Contact = new Type({
  name: 'Contact',
  fields: () => ({
    ...userFields,
    nonprofit: {type: Nonprofit},
    phoneSecondary: {type: Str},
    phoneSecondaryType: {type: Str},
    userId: {type: Str}
  }),
  interfaces: [User]
})

const Nonprofit = new Type({
  name: 'Nonprofit',
  fields: () => ({
    id: {type: Str},
    name: {type: Str},
    description: {type: Str},
    contacts: {type: new List(Contact)},
    projects: {type: new List(Project)},
    causes: {type: new List(Cause)}
  })
})

const Photographer = new Type({
  name: 'Photographer',
  fields: () => ({
    ...userFields,
    availabilities: {type: new List(Str)},
    cameraPhone: {type: Bool},
    cameraFilm: {type: Bool},
    cameraDSLR: {type: Bool},
    cameraOther: {type: Str},
    causes: {type: new List(Cause)},
    instagram: {type: new NonNull(Str)},
    portfolio: {type: Str},
    preferredContactMethod: {type: Str},
    projects: {type: new NonNull(new List(Project))},
    userId: {type: Str}
  }),
  interfaces: [User]
})

const Project = new Type({
  name: 'Project',
  description: 'Nonprofit projects',
  fields: () => ({
    id: {type: new NonNull(Str)},
    name: {type: new NonNull(Str)},
    description: {type: new NonNull(Str)},
    date: {type: new NonNull(Str)},
    dateIsApprox: {type: new NonNull(Bool)},
    location: {type: Str},
    status: {type: Str},
    photographers: {type: new NonNull(new List(Photographer))},
    photoLink: {type: Str},
    nonprofitId: {type: new NonNull(Str)}
  })
})

// ******
// Inputs
// ******

const ContactInput = new Input({
  name: 'ContactInput',
  fields: {
    phoneSecondary: {type: Str},
    phoneSecondaryType: {type: Str}
  }
})

const PhotographerInput = new Input({
  name: 'PhotographerInput',
  fields: {
    instagram: {type: Str},
    cameraPhone: {type: Bool},
    cameraFilm: {type: Bool},
    cameraDSLR: {type: Bool},
    cameraOther: {type: Str},
    preferredContactMethod: {type: Str},
    causes: {type: new List(Int)},
    availabilities: {type: new List(Str)}
  }
})

const ProjectInput = new Input({
  name: 'ProjectInput',
  fields: {
    name: {type: Str},
    description: {type: Str},
    nonprofitId: {type: Str},
    date: {type: Str},
    dateIsApprox: {type: Str},
    location: {type: Str}
  }
})

const NonprofitInput = new Input({
  name: 'NonprofitInput',
  fields: {
    name: {type: Str},
    description: {type: Str}
  }
})

const SearchQueries = new Input({
  name: 'SearchQueries',
  fields: {
    firstname: {type: Str},
    lastname: {type: Str},
    instagram: {type: Str},
    role: {type: Str},
    cameraDSLR: {type: Bool},
    cameraPhone: {type: Bool},
    cameraFilm: {type: Bool},
    interests: {type: new List(Int)},
    availabilities: {type: new List(Str)}
  }
})

const UserInput = new Input({
  name: 'UserInput',
  fields: {
    email: {type: Str},
    firstname: {type: Str},
    lastname: {type: Str},
    phone: {type: Str},
    phoneType: {type: Str},
    role: {type: Str}
  }
})

// *******
// Queries
// *******

// query arguments
// function ({vars, req}, args, req, info)

const Query = new Type({
  name: 'Query',
  fields: () => ({
    getMe: {
      type: User,
      resolve: ({req: {user: {id}}}) => UserC.get({id})
    },
    getNonprofits: {
      type: new List(Nonprofit),
      resolve: (_, __, {user}, info) => user.role === 'admin' && NonprofitC.getAll()
    },
    getNonprofit: {
      type: Nonprofit,
      args: {
        id: {type: Id}
      },
      resolve: ({args: { id }}) => NonprofitC.get(id)
    },
    getAllPhotographers: {
      type: new List(Photographer),
      resolve: (_, __, {user}) => user.role === 'admin' && PhotographerC.getAll()
    },
    getPhotographer: {
      type: Photographer,
      args: {
        userId: {type: Id}
      },
      resolve: (_, {userId}) => UserC.get({id: userId})
    },
    getProjects: {
      type: new List(Project),
      args: {
        id: {type: Id},
        nonprofitId: {type: Id}
      },
      resolve: (_, args, {user}) => ProjectC.get(args, user)
    },
    getUser: {
      type: User,
      args: {
        id: {type: Id},
        email: {type: Str}
      },
      resolve: ({args: query}) => UserC.get(query)
    },
    searchStorytellers: {
      type: new List(Photographer),
      args: {
        queries: {type: Str}
      },
      resolve: (_, {queries}) => search(queries, 'storyteller')
    },
    searchNonprofits: {
      type: new List(Nonprofit),
      args: {
        queries: {type: Str}
      },
      resolve: (_, {queries}) => search(queries, 'nonprofit')
    }
  })
})

// Resolver arguments
// function ({vars, req}, args, req, info)
const Mutation = new Type({
  name: 'Mutation',
  fields: () => ({
    updateProjectPhotographer: {
      type: Project,
      args: {
        id: {type: Int},
        photographerUserId: {type: Id},
        action: {type: Str}
      },
      resolve: (_, {id, photographerUserId, action}) => ProjectC.updatePhotographer(id, photographerUserId, action)
    },
    createProject: {
      type: Project,
      args: {
        project: {type: ProjectInput}
      },
      resolve: ({req}, {project}) => ProjectC.create(project, req.user)
    },
    updateContactMe: {
      type: Contact,
      args: {
        updates: {type: ContactInput}
      },
      resolve: ({ args: { updates }, req: { user: { id } } }) => ContactC.update({id}, updates)
    },
    updateMe: {
      type: User,
      args: {
        updates: {type: UserInput}
      },
      resolve: ({ args: { updates }, req: { user: { id } } }) => UserC.update({id}, updates)
    },
    updateNonprofit: {
      type: Nonprofit,
      args: {
        id: {type: Str},
        updates: {type: NonprofitInput}
      },
      resolve: ({ args: {id, updates} }) => NonprofitC.update(id, updates)
    },
    updateProject: {
      type: Project,
      args: {
        id: {type: Int},
        updates: {type: ProjectInput}
      },
      resolve: ({ args: {id, updates} }) => ProjectC.update(id, updates)
    },
    updatePhotographerMe: {
      type: Photographer,
      args: {
        updates: {type: PhotographerInput}
      },
      resolve: ({ args: { updates }, req: { user: { id } } }) => PhotographerC.update({id}, updates)
    }
  })
})

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  types: [
    Admin,
    Cause,
    Contact,
    Project,
    Nonprofit,
    Photographer,
    ContactInput,
    PhotographerInput,
    ProjectInput,
    NonprofitInput,
    SearchQueries,
    UserInput
  ]
})
