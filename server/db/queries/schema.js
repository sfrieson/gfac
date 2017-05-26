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
    photoLink: {type: Str},
    nonprofitId: {type: new NonNull(Str)}
  })
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
  fields: {
    ...userFields,
    availabilities: {type: new List(Str)},
    cameraPhone: {type: Bool},
    cameraFilm: {type: Bool},
    cameraDSLR: {type: Bool},
    cameraOther: {type: Str},
    causes: {type: new List(Cause)},
    portfolio: {type: Str},
    preferredContactMethod: {type: Str},
    userId: {type: Str}
  },
  interfaces: [User]
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
    cameraFilm: {type: Bool}
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
const Query = new Type({
  name: 'Query',
  fields: () => ({
    getMeContact: {
      type: Contact,
      resolve: (_, req) => UserC.get({id: req.user.id})
    },
    getMePhotographer: {
      type: Photographer,
      resolve: (_, req) => UserC.get({id: req.user.id})
    },
    getMe: {
      type: User,
      resolve: (_, req) => UserC.get({id: req.user.id})
    },
    getNonprofit: {
      type: Nonprofit,
      args: {
        id: {type: Id}
      },
      resolve: ({ id }) => NonprofitC.get(id)
    },
    getPhotographer: {
      type: Photographer,
      args: {
        userId: {type: Id}
      },
      resolve: (args) => UserC.get({id: args.userId})
    },
    getProjects: {
      type: new List(Project),
      args: {
        nonprofitId: {type: Id}
      },
      resolve: (args, { user }) => ProjectC.get(args, user)
    },
    getUser: {
      type: User,
      args: {
        id: {type: Id},
        email: {type: Str}
      },
      resolve: (query) => UserC.get(query)
    },
    search: {
      type: new List(Photographer),
      args: {
        queries: {type: SearchQueries}
      },
      resolve: (args) => UserC.search(args.queries)
    }
  })
})

const Mutation = new Type({
  name: 'Mutation',
  fields: () => ({
    createProject: {
      type: Project,
      args: {
        project: {type: ProjectInput}
      },
      resolve: (args) => ProjectC.create(args.project)
    },
    updateContactMe: {
      type: Contact,
      args: {
        updates: {type: ContactInput}
      },
      resolve: (args, req) => ContactC.update({id: req.user.id}, args.updates)
    },
    updateMe: {
      type: User,
      args: {
        updates: {type: UserInput}
      },
      resolve: (args, req) => UserC.update({id: req.user.id}, args.updates)
    },
    updateNonprofit: {
      type: Nonprofit,
      args: {
        id: {type: Str},
        updates: {type: NonprofitInput}
      },
      resolve: ({id, updates}) => NonprofitC.update(id, updates)
    },
    updateProject: {
      type: Project,
      args: {
        id: {type: Int},
        updates: {type: ProjectInput}
      },
      resolve: ({id, updates}) => ProjectC.update(id, updates)
    },
    updatePhotographerMe: {
      type: Photographer,
      args: {
        updates: {type: PhotographerInput}
      },
      resolve: (args, req) => PhotographerC.update({id: req.user.id}, args.updates)
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
