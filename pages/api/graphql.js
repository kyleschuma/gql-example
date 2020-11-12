import { ApolloServer, gql } from 'apollo-server-micro';
import data from './data.json';
import distances from './distances.json';

const typeDefs = gql`
  type Query {
    getSkiResort(key: ID!): SkiResort
    listSkiResorts(query: String): [SkiResort!]!
  }

  enum SkiRunDifficulty {
    beginner
    intermediate
    advanced
    expert
  }

  enum SkiLiftType {
    chair_lift
    gondola
    magic_carpet
    tbar
    platter
    rope_tow
    drag_lift
    cable_car
    jbar
  }

  type SkiResort {
    key: ID!
    name: String!
    skiableAcres: Int!
    annualSnowfall: Int!

    lifts: [SkiLift!]!
    runs: [SkiRun!]!
    nearby(distanceMiles: Int = 25): [SkiResort!]!
  }

  type SkiLift {
    name: String
    type: SkiLiftType
  }

  type SkiRun {
    name: String
    difficulty: SkiRunDifficulty
  }
`;

const resolvers = {
  SkiResort: {
    nearby(parent, args, ctx) {
      const { distanceMiles } = args;
      const { key: from } = parent;
      const nearby = Object.keys(distances[from]).filter(
        to => distances[from][to] <= distanceMiles
      );

      return nearby.map(key => data[key]);
    },
  },
  Query: {
    getSkiResort(parent, args, ctx) {
      const { key } = args;
      return data[key];
    },
    listSkiResorts(parent, args, context) {
      const { query } = args;
      const values = Object.values(data).filter(item =>
        query ? item.name.toLowerCase().startsWith(query.toLowerCase()) : true
      );
      return values;
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
