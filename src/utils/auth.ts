import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("wanderLust");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  plugins: [ jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 24 * 60 * 60,
    },
  },
});
