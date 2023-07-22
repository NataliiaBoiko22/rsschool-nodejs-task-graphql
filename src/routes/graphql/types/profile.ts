/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType,
  } from 'graphql';
  import { UUIDType } from './uuid.js';
  import { memberType, memberTypeIdEnum} from './member.js';
    import { IId, IPrisma } from './general.js';
    import { MemberTypeId } from '../../member-types/schemas.js';
  import { userType } from './user.js';

export type IProfileInput = {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
};
export interface IProfile extends IId, IProfileInput {}
  export const profileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
      userId: { type: UUIDType },
      memberTypeId: { type: memberTypeIdEnum },
      user: {
        type: userType,
        resolve: async (source: IProfile, __: unknown, { prisma }: IPrisma) => {
          const { userId } = source;
          return prisma.user.findUnique({ where: { id: userId } });
        },
      },
      memberType: {
        type: new GraphQLNonNull(memberType),
        resolve: async (source: IProfile, __: unknown, { prisma }: IPrisma) => {
          const { memberTypeId } = source;
          return prisma.memberType.findUnique({ where: { id: memberTypeId } });
        },
      },
    }),
  });

  export const createProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt},
      memberTypeId: { type: memberTypeIdEnum },
      userId: { type: new GraphQLNonNull(UUIDType)  },
    },
  });
  
  export const changeProfileInputType = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      memberTypeId: { type: memberTypeIdEnum },
    },
  });

