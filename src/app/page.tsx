"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { trpc } from "./_trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { convertDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  const { data } = trpc.folders.getFolders.useQuery();

  return (
    <main className="container">
      <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2  gap-4 mt-2">
        {data?.map((item) => (
          <Link
            key={item.id}
            href={item.id}
            className="border rounded-xl hover:bg-secondary disabled:opacity-25 disabled:hover:bg-transparent flex flex-col"
          >
            <div className="p-3 pb-0 flex flex-col items-center flex-1">
              <Building2 className="h-14 w-14 flex-shrink-0" />
              <div className="flex flex-col items-center h-full justify-center text-center mt-2">
                <h1 className="text-sm">{item.name}</h1>
                <p className="text-muted-foreground text-xs">
                  {convertDate(item.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex w-full items-center justify-center py-2 border-t mt-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{item.author.email[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col ml-1">
                <h1 className="text-xs text-muted-foreground">created by</h1>
                <h1 className="text-xs truncate">
                  {item.author.name + " " + item.author.surname[0]}
                </h1>
              </div>
            </div>
          </Link>
        ))}
        {!data &&
          Object.entries([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map(
            (item, index) => (
              <Skeleton key={index} className="rounded-xl w-full p-6 h-44" />
            )
          )}
        {data?.length === 0 && (
          <span className="text-muted-foreground text-2xl">No Folders</span>
        )}
      </div>
      <div className="flex justify-center items-center h-full"></div>
    </main>
  );
}
