/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PrismaClient, Profile, User, Post, MemberType  } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeId } from '../member-types/schemas.js';

export interface IDataLoaders {
  userLoader: DataLoader<string, User>;
  profileByIdLoader: DataLoader<string, Profile>;
  postsByIdLoader: DataLoader<string, Post[]>;
  memberTypeLoader: DataLoader<MemberTypeId, MemberType>;
  profilesByMemberTypeLoader: DataLoader<MemberTypeId, Profile[]>;
}
export const loadersHandler = (prisma: PrismaClient): IDataLoaders => {

  const userLoader = new DataLoader<string, User>(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in:  ids as string[]} },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });

    const userMap: Record<string, User> = {};
    for (const user of users) {
      userMap[user.id] = user;
    }
    return ids.map((id) => userMap[id]);
  });

  const profileByIdLoader = new DataLoader<string, Profile>(async (ids) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } },
    });

    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.userId] = profile;
      return acc;
    }, {} as Record<string, Profile>);

    return ids.map((id) => profileMap[id]);
  });

const postsByIdLoader = new DataLoader<string, Post[]>(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds as string[]} },
    });

    const postMap: Record<string, Post[]> = {};
    for (const post of posts) {
      if (postMap[post.authorId]) {
        postMap[post.authorId].push(post);
      } else {
        postMap[post.authorId] = [post];
      }
    }

    return authorIds.map((authorId) => postMap[authorId] || []);
  });

  const memberTypeLoader = new DataLoader<MemberTypeId, MemberType>(async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as string[] } },
    });

    const memberTypeMap = memberTypes.reduce((acc, memberType) => {
      acc[memberType.id] = memberType;
      return acc;
    }, {} as Record<MemberTypeId, MemberType>);

    return ids.map((id) => memberTypeMap[id]);
  });

  const profilesByMemberTypeLoader = new DataLoader<MemberTypeId, Profile[]>(async (memberTypeIds) => {
    const profiles = await prisma.profile.findMany({
      where: { memberTypeId: { in: memberTypeIds as string[] } },
    });

    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.memberTypeId]
        ? acc[profile.memberTypeId].push(profile)
        : (acc[profile.memberTypeId] = [profile]);
      return acc;
    }, {} as Record<string, Profile[]>);

    return memberTypeIds.map((id) => profileMap[id] || []);
  });


  return {
    userLoader,
    profileByIdLoader,
    postsByIdLoader,
    memberTypeLoader,
    profilesByMemberTypeLoader,
  };
};
