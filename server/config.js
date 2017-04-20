require('dotenv').config();

export const port = process.env.PORT;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const databaseUrl = process.env.DATABASE_URL;

export const auth = {
  // TODO Change the secret
  jwt: {secret: process.env.JWT_SECRET},
  salt: +process.env.SALT
};