import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prismaSingleton";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const { session } = await getServerAuthSession();

  return {
    session: session,
    db:prisma
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
