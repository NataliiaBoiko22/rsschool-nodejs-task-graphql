import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
  } from 'graphql';
  import { UUIDType } from './uuid.js';
  import { IPrisma, IId} from './general.js';
  import { userType } from './user.js';
  
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
        resolve: async ({ id }: IId, { prisma }: IPrisma) =>
        {
            const user = await prisma.user.findUnique({ where: { id } });
            return user;
          }
      },
    }),
  });
  
