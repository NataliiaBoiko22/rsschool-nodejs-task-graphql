import { PrismaClient } from '@prisma/client';

export interface IId {
  id: string;
}

export interface IPrisma {
  prisma: PrismaClient;
}

