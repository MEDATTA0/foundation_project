import { betterAuth } from 'better-auth';

const MAX_PASSWORD_LENGTH = 21;
const MIN_PASSWORD_LENGTH = 8;

export const authConfig = betterAuth({
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'student', input: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
  },
});
