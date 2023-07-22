import {
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInputObjectType
  } from 'graphql';
  import { UUIDType } from './uuid.js';
 import { profileType } from './profile.js';
import { postType } from './post.js';
import { IPrisma } from './general.js';
import { IId } from './general.js';
export interface IUserInput {
  name: string;
  balance: number;
}
export interface IUser extends IId, IUserInput {}
  export const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: (UUIDType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType as GraphQLObjectType,
      resolve: async (source: IUser, __: unknown, { prisma }: IPrisma) =>
      {
        const { id } = source;
        const profile = await prisma.profile.findUnique({ where: { userId: id } })
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (source: IUser, __: unknown, { prisma }: IPrisma) =>
       {
        const { id } = source;
  const posts = await prisma.post.findMany({ where: { authorId: id } });
  return posts;
}
    },
      userSubscribedTo: {type: new GraphQLList(userType),
    async resolve(source: IUser, __: unknown, { prisma }: IPrisma) {
      const { id } = source;
      const indexes = await prisma.subscribersOnAuthors.findMany({
        
        where: { subscriberId: id },
      });

      return await prisma.user.findMany({
        where: {
          id: {
            in: indexes.map((user) => user.authorId),
          },
        },
      });
    }
    },
    subscribedToUser: {type: new GraphQLList(userType),
    async resolve(source: IUser, __: unknown, { prisma }: IPrisma) {
      const { id } = source;
      const indexes =  await prisma.subscribersOnAuthors.findMany({
        where: { authorId: id },
      });

      return await prisma.user.findMany({
        where: {
          id: {
            in: indexes.map((user) => user.subscriberId), 
          },
        },
      });
    }},
  })
});

export const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const changeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

