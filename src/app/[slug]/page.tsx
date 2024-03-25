"use client";

import DownloadItem from "@/components/DownloadItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { trpc } from "../_trpc/client";
import useMounted from "@/hooks/use-mounted";
import { notFound } from "next/navigation";
import CodeDialog from "@/components/CodeDialog";
import PreviewDialog from "@/components/PreviewDialog";
import { PreviewState } from "@/lib/types";

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const mounted = useMounted();

  const { data: userFolder, error: userFolderError } =
    trpc.folders.getUserFolder.useQuery(
      { id: slug },
      {
        refetchOnWindowFocus: false,
        refetchInterval: 0,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchIntervalInBackground: false,
        retryOnMount: false,
        retry: false,
      }
    );

  const {
    data: publicFolder,
    mutate,
    isLoading,
    isError,
    error,
  } = trpc.folders.getFolder.useMutation();

  const [open, setOpen] = useState<boolean>(true);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  useEffect(() => {
    if (error?.message) error.data?.code === "NOT_FOUND" ? notFound() : null;
  }, [isError]);

  const getAccess = useCallback(
    (password: string) => {
      mutate({
        id: slug,
        password,
      });
    },
    [slug]
  );

  const folder = userFolder || publicFolder;

  useEffect(() => {
    if (folder) setOpen(false);
  }, [folder]);

  return (
    <div className="container">
      {mounted && userFolderError?.data?.code && (
        <CodeDialog
          error={typeof error?.data?.code === "string" ? error.data.code : null}
          getAccess={getAccess}
          isError={isError}
          isLoading={isLoading}
          open={open}
          setOpen={setOpen}
        />
      )}
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mt-12">
        Folder {folder?.name}
      </h1>

      <h1 className="text-2xl font-semibold mt-12">Shared files:</h1>
      <h2 className="text-base text-muted-foreground">
        (Click on download icon to download the file)
      </h2>

      <div className="grid xl:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 mt-6 gap-4">
        {folder
          ? folder.files.map((item) => (
              <DownloadItem key={item.id} file={item} setPreview={setPreview} />
            ))
          : Object.entries([1, 2, 3, 4, 5, 6]).map((item, index) => (
              <Skeleton key={index} className=" w-full p-6 h-60" />
            ))}
      </div>
      <PreviewDialog preview={preview} setPreview={setPreview}/>
    </div>
  );
};

export default Page;
