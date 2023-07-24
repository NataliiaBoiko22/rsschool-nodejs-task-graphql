import { PrismaClient } from '@prisma/client';
import { IDataLoaders } from '../loadersHandler.js';
export interface IId {
  id: string;
}
export interface IUserInput {
  name: string;
  balance: number;
}
export interface IPrisma extends IDataLoaders {
  prisma: PrismaClient;
  dataLoaders: IDataLoaders; 
}
export interface ISubscription {
  subscriberId: string;
  authorId: string;
}

export interface ISubscriptionUpdate {
  userId: string;
  authorId: string;
}

export interface IPrismaPlusLoaders extends IPrisma {
  dataLoaders: IDataLoaders;
}

export type User = {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo?: {
    subscriberId: string;
    authorId: string;
  }[];
  subscribedToUser?: {
    subscriberId: string;
    authorId: string;
  }[];
};

