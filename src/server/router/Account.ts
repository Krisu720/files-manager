import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { hash } from "bcrypt";

export const accountRouter = router({
  createAccount: publicProcedure
    .input(z.object({ email: z.string(), password: z.string(),name: z.string(),surname: z.string() }))
    .mutation(async ({ input: { email, password,name,surname },ctx }) => {
      const user = await ctx.db.user.findFirst({ where: { email } });

      if (user) throw new Error("Email jest zajęty");

      const salts = process.env.BCRYPT_SALTS as string;
      const hashedPassword = await hash(password, parseInt(salts));

      await ctx.db.user.create({ data: { email, password: hashedPassword,name,surname } });

      return true
    }),
});
