import {helloHandler} from "./hello";
import {createSchema} from "graphql-yoga";
import {getUsers} from "src/graphql/users";

// Construct a schema, using GraphQL schema language
export const schema = createSchema({
    typeDefs: `
        type User {
            id: String!
            name: String!
            email: String!
            profileImage: String
        }
        type Query {
            hello: String
            users(smeId: String!): [User]
        }
        `,
    resolvers: {
        Query: {
            hello: helloHandler,
            users:(_, args) => getUsers(args.smeId),
        }
    }
});