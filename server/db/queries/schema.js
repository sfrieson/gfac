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

import { GraphQLDateTime as ISODateTime } from 'graphql-iso-date'

import {
  ContactController as ContactC,
  NonprofitController as NonprofitC,
  StorytellerController as StorytellerC,
  UserController as UserC,
  ProjectController as ProjectC
} from '../controllers'

import { search } from '../elasticlunr'

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
        case 'storyteller':
          return Storyteller
      }
    } else {
      if (user.nonprofit) return Contact
      if (user.instagram) return Storyteller
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
    causes: {type: new List(Cause)},
    contacts: {type: new NonNull(new List(Contact))},
    description: {type: Str},
    name: {type: Str},
    projects: {type: new List(Project)},
    primaryContact: {
      type: new NonNull(Contact),
      resolve ({ contacts }) {
        return contacts[0]
      }
    }
  })
})

const Storyteller = new Type({
  name: 'Storyteller',
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
    // attachments: {type: new List(Attachment)},
    attendance: {type: Str},
    causes: {type: new List(Cause)},
    date: {type: new NonNull(ISODateTime)},
    dateIsApprox: {type: new NonNull(Bool)},
    description: {type: new NonNull(Str)},
    duration: {type: Int},
    location: {type: Str},
    name: {type: new NonNull(Str)},
    nonprofitId: {type: new NonNull(Str)},
    nonprofit: {type: new NonNull(Nonprofit)},
    photoLink: {type: Str},
    storytellers: {type: new NonNull(new List(Storyteller))},
    storytellersNeeded: {type: Int},
    status: {type: Str}, // enum: prospective, planning, past, completed
    venueName: {type: Str},
    venueType: {type: Str},
    website: {type: Str}
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

const StorytellerInput = new Input({
  name: 'StorytellerInput',
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

const ProjectCreation = new Input({
  name: 'ProjectCreation',
  fields: {
    // attachments: {type: new List(Attachment)},
    attendance: {type: Str},
    date: {type: new NonNull(ISODateTime)},
    dateIsApprox: {type: new NonNull(Bool)},
    description: {type: new NonNull(Str)},
    duration: {type: Int},
    location: {type: Str},
    name: {type: new NonNull(Str)},
    nonprofitId: {type: new NonNull(Str)},
    photoLink: {type: Str},
    storytellersNeeded: {type: Int},
    status: {type: Str}, // enum: prospective, planning, past, completed
    venueName: {type: Str},
    venueType: {type: Str},
    website: {type: Str}
  }
})
const ProjectUpdates = new Input({
  name: 'ProjectUpdates',
  fields: {
    // attachments: {type: new List(Attachment)},
    attendance: {type: Str},
    date: {type: ISODateTime},
    dateIsApprox: {type: Bool},
    description: {type: Str},
    duration: {type: Int},
    location: {type: Str},
    name: {type: Str},
    nonprofitId: {type: Str},
    photoLink: {type: Str},
    storytellersNeeded: {type: Int},
    status: {type: Str}, // enum: prospective, planning, past, completed
    venueName: {type: Str},
    venueType: {type: Str},
    website: {type: Str}
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
      resolve: ({req: {user: {id}, res}}) => UserC.get({id}).catch(err => err.message === 'No user' && res.redirect('/logout'))
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
    getAllStorytellers: {
      type: new List(Storyteller),
      resolve: (_, __, {user}) => user.role === 'admin' && StorytellerC.getAll()
    },
    getStoryteller: {
      type: Storyteller,
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
    project: {
      type: Project,
      args: {
        id: {type: new NonNull(Id)}
      },
      resolve: (_, args, {user}) => ProjectC.getOne(args.id, user)
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
      type: new List(Storyteller),
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
    updateProjectStoryteller: {
      type: Project,
      args: {
        id: {type: Int},
        storytellerUserId: {type: Id},
        action: {type: Str}
      },
      resolve: (_, {id, storytellerUserId, action}) => ProjectC.updateStoryteller(id, storytellerUserId, action)
    },
    createProject: {
      type: Project,
      args: {
        project: {type: ProjectCreation}
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
        id: {type: Id},
        updates: {type: ProjectUpdates}
      },
      resolve: (_, {id, updates}) => ProjectC.update(id, updates)
    },
    updateStorytellerMe: {
      type: Storyteller,
      args: {
        updates: {type: StorytellerInput}
      },
      resolve: ({ args: { updates }, req: { user: { id } } }) => StorytellerC.update({id}, updates)
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
    Storyteller,
    ContactInput,
    StorytellerInput,
    ProjectCreation,
    ProjectUpdates,
    NonprofitInput,
    SearchQueries,
    UserInput
  ]
})
