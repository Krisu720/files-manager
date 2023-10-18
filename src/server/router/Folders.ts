import { prisma } from "@/lib/prismaSingleton";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { File } from "@prisma/client";

export const foldersRouter = router({
  getFolders: publicProcedure.query(async ({ ctx }) => {
    const folders = await ctx.db.folder.findMany({ include: { author: true } });
    return folders.map((item) => {
      const { password, ...withoutPassword } = item;
      return { ...withoutPassword };
    });
  }),
  getFolder: publicProcedure
    .input(z.object({ id: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const folder = await prisma.folder.findUnique({
        where: { id: input.id },
        include: { files: true },
      });
      if (!folder) throw new TRPCError({ code: "NOT_FOUND" });

      const isPasswordValid = input.password.toUpperCase() === folder.password;

      if (!isPasswordValid) throw new TRPCError({ code: "UNAUTHORIZED" });

      const { password, ...withoutPassword } = folder;

      return withoutPassword;
    }),
  getUserFolders: protectedProcedure.query(async ({ ctx }) => {
    const folders = await ctx.db.folder.findMany({
      where: { userId: ctx.session.user.userId },
      include: { files: true },
    });

    return folders;
  }),
  createFolder: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        password: z
          .string()
          .max(4, { message: "Password can't have more than 4 letters." }),
        files: z
          .object({
            name: z.string(),
            type: z.string(),
            size: z.number(),
            fileBuffer: z.string(),
          })
          .array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const folders = await prisma.folder.findMany({
        where: { userId: ctx.session.user.userId },
        include: { files: true },
      });

      const foldersSize = folders.reduce(
        (acc, folder) =>
          acc + folder.files.reduce((acc, file) => acc + file.size, 0),
        0
      );
      

      let totalSize = 0;

      for (const { size } of input.files) {
        totalSize += size;
      }

      if(foldersSize + totalSize > 20000000) throw new TRPCError({code:"PAYLOAD_TOO_LARGE"});

      const folder = await prisma.folder.create({
        data: {
          name: input.name,
          userId: ctx.session.user.userId,
          password: input.password.toUpperCase(),
        },
      });

      const outputArray: Omit<File, "createdAt" | "id">[] = [];
      for (const { fileBuffer, name, type, size } of input.files) {
        outputArray.push({
          name,
          type,
          size,
          base64: fileBuffer,
          folderId: folder.id,
        });
      }
      await ctx.db.file.createMany({ data: outputArray });
      return true;
    }),
  removeFolder: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const folder = await prisma.folder.findUnique({
        where: { id: input },
        include: { files: true },
      });
      if (!folder) throw new TRPCError({ code: "NOT_FOUND" });

      if (ctx.session.user.userId === folder.userId) {
        let deleteIds: string[] = [];
        for (const file of folder.files) {
          deleteIds.push(file.id);
        }
        await ctx.db.file.deleteMany({ where: { id: { in: deleteIds } } });
        const removedFolder = await ctx.db.folder.delete({
          where: { id: input },
        });
        return removedFolder;
      } else throw new TRPCError({ code: "UNAUTHORIZED" });
    }),
});
