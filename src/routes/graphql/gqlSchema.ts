/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLString
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { userType } from './types/user.js';
import { postType } from './types/post.js';
import { memberType, memberTypeIdEnum } from './types/member.js';
import { profileType } from './types/profile.js';
import { createUserInputType, changeUserInputType } from './types/user.js';
import { createProfileInputType, changeProfileInputType } from './types/profile.js';
import { createPostInputType, changePostInputType } from './types/post.js';
import { IMemberType } from './types/member.js';
import { IId, IPrisma } from './types/general.js';
import { IUserInput } from './types/user.js';
import { IPostInput } from './types/post.js';
import { IProfile, IProfileInput } from './types/profile.js';
import { ISubscription } from './types/general.js';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
        memberTypes: {
      type: new GraphQLList(memberType),
            async resolve(__: unknown, _: unknown, { prisma }: IPrisma) {
              const memberTypes = await prisma.memberType.findMany();
              return memberTypes;
            },
      },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (__: unknown, _: unknown, { prisma }: IPrisma) => {
        const posts = await prisma.post.findMany();
        return posts;
      }
    },
    users: {
      type: new GraphQLList(userType),
      resolve: async (_: unknown, __: unknown, { prisma }: IPrisma) => {
        const users = await prisma.user.findMany();
        return users;
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (_: unknown, __: unknown, { prisma }: IPrisma) => {
        const profiles = await prisma.profile.findMany();
        return profiles;
      },
    },
    memberType: {
      type: memberType,
      args: {
        id: { type: new GraphQLNonNull(memberTypeIdEnum) },
      },
      resolve: async (__: unknown, args: IMemberType, { prisma }: IPrisma) => {
        const { id } = args;
        const member = await prisma.memberType.findUnique({ where: { id } });
        return member;
      },
    },

    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (__: unknown, args: IId, { prisma }: IPrisma) => {
        const { id } = args;
        const post = await prisma.post.findUnique({ where: { id } });
        return post;
      },
    },
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, args: { id: string }, { prisma }: IPrisma) => {
        const { id } = args;
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
      },
    },
    profile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, args: IProfile, { prisma }: IPrisma) => {
        const { id } = args;
        const profile = await prisma.profile.findUnique({ where: { id } });
        return profile;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',

fields: {
      createPost: {
        type: postType,
        args: { dto: { type: createPostInputType } },
        async resolve(_: unknown, args: { dto: IPostInput }, { prisma }: IPrisma) {
          const { dto: data  } = args;
          return prisma.post.create({
            data: data,
          });
        },
      },
      changePost: {
        type: postType,
        args: { id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changePostInputType }},
        async resolve(_: unknown, args: {id: string, dto: IPostInput }, { prisma }: IPrisma) {
          return prisma.post.update({
            where: { id: args.id },
            data: args.dto,
          });
        },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: {type: new GraphQLNonNull(UUIDType)} },
      async resolve(_: unknown, args: { id: string }, { prisma }: IPrisma) {
        await prisma.post.delete({
          where: {
            id: args.id,
          },
        });
        return null
      },
    },
      createUser: {
        type: userType,
        args: { dto: { type: createUserInputType } },
        async resolve(_: unknown, args: { dto: IUserInput }, { prisma }: IPrisma) {
          return prisma.user.create({
            data: args.dto,
          });
        },
      },
      changeUser: {
        type: userType,
        args: { id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: changeUserInputType },},
        async resolve(_: unknown, args: { dto: IUserInput, id: string }, { prisma }: IPrisma) {
          return prisma.user.update({
            where: { id: args.id },
            data: args.dto,
          });
        },
      },
      deleteUser: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType)} },
        async resolve(_: unknown, args: { id: string }, { prisma }: IPrisma) {
          await prisma.user.delete({
            where: {
              id: args.id,
            },
          });
          return null
        },
      },
      createProfile: {
        type: profileType,
        args: { dto: { type: createProfileInputType } },
        async resolve(_: unknown, args: { dto: IProfileInput }, { prisma }: IPrisma) {
          const { dto: data  } = args;
          return prisma.profile.create({
            data: data,
          });
        },
      },
      changeProfile: {
        type: profileType,
        args: { id: { type: UUIDType },
        dto: { type: changeProfileInputType },},
        async resolve(_: unknown, args: { id: string , dto: IProfileInput }, { prisma }: IPrisma) {
          return prisma.profile.update({
            where: { id: args.id },
            data: args.dto,
          });
        },
      },
     
      deleteProfile: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        async resolve(_: unknown, args: { id: string }, { prisma }: IPrisma) {
          await prisma.profile.delete({
            where: {
              id: args.id,
            },
          });
          return null
        },
      },    
      subscribeTo: {
        type: userType,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        async resolve(_: unknown,  { userId: id, authorId }: ISubscription, { prisma }: IPrisma) {
          const user = prisma.user.update({
            where: { id },
            data: { userSubscribedTo: { create: { authorId } } },
          });
          return user;
        },
      },
      unsubscribeFrom: {
        type: GraphQLString,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        async resolve(_: unknown, { userId: subscriberId, authorId }: ISubscription, { prisma }: IPrisma) {
          await prisma.subscribersOnAuthors.delete({
            where: { subscriberId_authorId: { subscriberId, authorId } },
        
          });
          return null
        },
        },
      },     
});
export const schema = new GraphQLSchema({ query, mutation});


