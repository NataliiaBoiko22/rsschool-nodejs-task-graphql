import {
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
  } from 'graphql';
  import { UUIDType } from './uuid.js';
 import { profileType } from './profile.js';
import { postType } from './post.js';
import { IPrisma } from '../types/general.js';
  export const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType as GraphQLObjectType,
      resolve: async (userId: string, { prisma }: IPrisma) =>
      {
        const profile = await prisma.profile.findUnique({
          where: { userId },
        });
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (authorId: string, { prisma }: IPrisma) =>
       {
  const posts = await prisma.post.findMany({ where: { authorId } });
  return posts;
}
    },
  })
})