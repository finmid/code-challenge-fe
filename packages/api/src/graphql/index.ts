import { createSchema } from 'graphql-yoga';
import { helloHandler } from './hello';
import { getCrewMembers } from 'src/graphql/crewMembers';

// Migration status: crewMembers is done. crews and jobs are still REST only.
export const schema = createSchema({
  typeDefs: `
        type CrewMember {
            id: String!
            name: String!
            alias: String
            role: String
            standing: String
            email: String!
            profileImage: String
        }
        type Query {
            hello: String
            crewMembers(crewId: String!): [CrewMember]
        }
        `,
  resolvers: {
    Query: {
      hello: helloHandler,
      crewMembers: (_, args) => getCrewMembers(args.crewId),
    },
  },
});
