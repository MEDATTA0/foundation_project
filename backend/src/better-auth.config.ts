import { betterAuth } from 'better-auth';
import { PrismaClient } from 'generated/prisma/client';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';
const MAX_PASSWORD_LENGTH = 21;
const MIN_PASSWORD_LENGTH = 8;

const prismaClient = new PrismaClient();
export const betterAuthConfig = betterAuth({
  plugins: [bearer()],
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
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prismaClient, { provider: 'mysql' }),
});

// type Session = typeof auth.$Infer.Session;
