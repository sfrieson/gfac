import Seqeulize from 'sequelize';
import {databaseUrl} from '../config';

const sequelize = new Seqeulize(
  databaseUrl,
  { // Application-wide settings
    timestamps: true, // set timestamps for creation and update. default: true
    // paranoid: true, // doesn't delete entries, just sets deleted at timestamp, default: false
    // underscored: false // Changes camel-cased names to snake-case, default: false
    // freezeTableName: false, // don't pluralize table name, default: true
  });

export default sequelize;