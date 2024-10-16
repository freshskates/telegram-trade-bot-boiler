
/* 

Reference:
    Best practice for instantiating Prisma Client with Next.js
        Date Today:
            10/02/2024
    Notes:
        To prevent multiple Prisma clients be instantiated 
    Reference:
        https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
  
    Instantiating Prisma Client 
        Date Today:
            10/02/2024
        Notes:
            Your application should generally only create one instance of PrismaClient.

        Reference:
            https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client
          
*/
import { PrismaClient } from '@prisma/client'

// Extend globalThis to include a custom property for Prisma
declare global {
    var prismaGlobal: PrismaClient | undefined;
  }
  
function getPrismaClientSingleton(): PrismaClient {

  if (globalThis.prismaGlobal == null){
      globalThis.prismaGlobal = new PrismaClient()
  }

  return globalThis.prismaGlobal

}

export default getPrismaClientSingleton
