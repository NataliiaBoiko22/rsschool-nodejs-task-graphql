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
import { IPrisma, IPrismaPlusLoaders } from './general.js';
import { IDataLoaders } from '../loadersHandler.js';
import { User } from './general.js';

export const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: (UUIDType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType as GraphQLObjectType,
      resolve: async (source: User, __: unknown, { dataLoaders }: IPrisma & { dataLoaders: IDataLoaders }) =>
      {
        const { id } = source;
        const profile = await dataLoaders.profileByIdLoader.load(id);
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (source: User, __: unknown, { dataLoaders }: IPrisma & { dataLoaders: IDataLoaders }) =>

       {
        const { id } = source;
  const posts = await dataLoaders.postsByIdLoader.load(id);
        return posts;
}
    },
    
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (
        { userSubscribedTo }: User,
        _args,
        { dataLoaders }: IPrismaPlusLoaders,
      ) => {
        if (Array.isArray(userSubscribedTo) && userSubscribedTo.length > 0) {
          return dataLoaders.userLoader.loadMany(userSubscribedTo.map(({ authorId }) => authorId));
        }

        return null;
      },
    },

    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (
        { subscribedToUser }: User,
        _args,
        { dataLoaders }: IPrismaPlusLoaders,
      ) => {
        if (Array.isArray(subscribedToUser) && subscribedToUser.length > 0) {
          return dataLoaders.userLoader.loadMany(
            subscribedToUser.map(({ subscriberId }) => subscriberId),
          );
        }

        return null;
      },}
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

