import { PrismaClient } from '@prisma/client';

export interface IId {
  id: string;
}

export interface IPrisma {
  prisma: PrismaClient;
}

export interface ISubscription {
  userId: string;
  authorId: string;
}