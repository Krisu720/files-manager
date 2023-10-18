import { httpBatchLink } from "@trpc/client";

import { AppRouter, appRouter } from "@/server";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      maxURLLength: 100000
    }),
  ],
});
