import {
  GraphQLEnumType,
  // GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { profileType } from './profile.js';
import { IPrisma } from './general.js';


export const memberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: {
      value: MemberTypeId.BASIC,
    },
    [MemberTypeId.BUSINESS]: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const memberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: memberTypeIdEnum },
    discount: { type: new GraphQLNonNull(GraphQLID) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async ( memberTypeId: MemberTypeId,
        { prisma }: IPrisma,) =>
        {
          const profiles = await prisma.profile.findMany({ where: { memberTypeId } });
          return profiles;
        }
    },
  }),
});