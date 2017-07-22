import Seqeulize from 'sequelize'

// const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
const isProd = process.env.NODE_ENV === 'production'

const databaseUrl = process.env.DATABASE_URL
const sequelize = new Seqeulize(
  databaseUrl,
  { // Application-wide settings
    timestamps: true, // set timestamps for creation and update. default: true
    paranoid: isProd, // doesn't delete entries, just sets deleted at timestamp, default: false
    // underscored: false // Changes camel-cased names to snake-case, default: false
    // freezeTableName: false, // don't pluralize table name, default: true,
    logging: (isTest || isProd) && (() => {})
  })

export default sequelize
