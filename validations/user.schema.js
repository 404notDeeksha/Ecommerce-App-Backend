const { z } = require("zod");

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const emailAuthSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
  }),
});

const passwordAuthSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
});

module.exports = {
  signupSchema,
  emailAuthSchema,
  passwordAuthSchema,
};