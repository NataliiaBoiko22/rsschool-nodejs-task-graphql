import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { profileType } from './profile.js';
import { MemberTypeId } from '../../member-types/schemas.js';

import { IPrisma } from './general.js';

export interface IMemberType {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
}

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
    id: { type: new GraphQLNonNull(memberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (source: IMemberType, __: unknown, { prisma }: IPrisma) => {
        const { id } = source;
        const member = await prisma.profile.findMany({ where: { memberTypeId: id } });
        return member;
      },
    },
  }),
});
