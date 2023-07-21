import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
  } from 'graphql';
  import { UUIDType } from './uuid.js';
  import { memberType } from './member.js';
  import { IPrisma, IId } from './general.js';
  import { userType } from './user.js';
  
  
  export const profileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
      memberType: {
        type: new GraphQLNonNull(memberType),
        resolve: async ({ id }: IId, { prisma }: IPrisma) =>
        {
            const memberType = await prisma.memberType.findUnique({ where: { id } });
            return memberType;
          }
      },
      user: {
        type: userType as GraphQLObjectType,
        resolve: async ({ id }: IId, { prisma }: IPrisma) =>
        {
            const user = await prisma.user.findUnique({ where: { id } });
            return user;
          }
          
      },
    }),
  });
