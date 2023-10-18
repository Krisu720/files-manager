import { router } from "./trpc";
import { foldersRouter } from "./router/Folders";
import { accountRouter } from "./router/Account";

export const appRouter = router({
  folders: foldersRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
