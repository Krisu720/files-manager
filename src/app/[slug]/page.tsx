"use client";

import DownloadItem from "@/components/DownloadItem";
import { Skeleton } from "@/components/ui/skeleton";
import CodeInput from "@/components/CodeInput";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { trpc } from "../_trpc/client";
import useMounted from "@/hooks/use-mounted";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { notFound, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const mounted = useMounted();

  const router = useRouter();

  const {
    data: folder,
    mutate,
    isLoading,
    isError,
    isSuccess,
    error,
  } = trpc.folders.getFolder.useMutation();

  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    if (isSuccess) setOpen(false);
  }, [isSuccess]);

  useEffect(() => {
    if (error?.message) error.data?.code === "NOT_FOUND" ? notFound() : null;
  }, [isError]);

  const [password, setPassword] = useState<string | null>(null);

  const [value, setValue] = useState<[string, string, string, string]>([
    "",
    "",
    "",
    "",
  ]);

  const checkLength = () => {
    const zeroValues = value.filter((item) => item.length === 0);
    if (zeroValues.length === 0) return false;
    else return true;
  };

  const getAccess = () => {
    mutate({
      id: slug,
      password: value[0] + value[1] + value[2] + value[3],
    });
  };

  return (
    <div className="container">
      {mounted && (
        <AlertDialog open={open} onOpenChange={(value) => setOpen(value)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Enter the code</AlertDialogTitle>
              <AlertDialogDescription>
                Enter the code to access the files.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex justify-evenly w-full my-2">
              <CodeInput
                value={value}
                setValue={setValue}
                onComplete={getAccess}
              />
            </div>
            {error && (
              <Alert variant="destructive" className="my-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error.data?.code === "UNAUTHORIZED" && "Wrong code."}
                </AlertDescription>
              </Alert>
            )}
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => router.back()}>
                Go back
              </Button>
              <Button
                disabled={checkLength() || isLoading}
                onClick={() => getAccess()}
                className="flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Next"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter mt-12">
        Folder {folder?.name}
      </h1>

      <h1 className="text-2xl font-semibold mt-12">Shared files:</h1>
      <h2 className="text-base text-muted-foreground">(Click on file to download)</h2>

      <div className="grid xl:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 mt-6 gap-4">
        {folder
          ? folder.files.map((item) => (
              <DownloadItem key={item.id} file={item} />
            ))
          : Object.entries([1, 2, 3, 4, 5, 6]).map((item, index) => (
              <Skeleton key={index} className=" w-full p-6 h-60" />
            ))}
      </div>
    </div>
  );
};

export default Page;
