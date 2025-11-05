import { betterAuth } from 'better-auth';
import { PrismaClient } from 'generated/prisma/client';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const MAX_PASSWORD_LENGTH = 21;
const MIN_PASSWORD_LENGTH = 8;

const prismaClient = new PrismaClient();
export const betterAuthConfig = betterAuth({
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'teacher', input: false },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
  },

  database: prismaAdapter(prismaClient, { provider: 'mysql' }),
});

// type Session = typeof auth.$Infer.Session;
