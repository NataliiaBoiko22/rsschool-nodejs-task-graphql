/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType
  } from 'graphql';
  import { UUIDType } from './uuid.js';
  import { IPrisma, IId} from './general.js';
  import { userType } from './user.js';
import { IDataLoaders } from '../loadersHandler.js';
  export interface IPostInput {
    title: string;
    content: string;
    authorId: string;
  }
  
  export interface IPost extends IId, IPostInput {}
  
  export const postType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      author: {
        type: userType,
        resolve: async (source: IPost, __: unknown, { dataLoaders }: IPrisma & { dataLoaders: IDataLoaders }) => {
          const { authorId } = source;
          return dataLoaders.userLoader.load(authorId);
        },
      },
    }),
  });

  export const createPostInputType = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
  });
  
  export const changePostInputType = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: {
      title: { type: GraphQLString },
      content: { type: GraphQLString },
    },
  });
  

