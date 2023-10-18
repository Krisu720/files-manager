"use client";

import FileDropArea, { FileObject } from "@/components/FileDropArea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  Eye,
  File,
  FileWarning,
  Loader2,
  Trash2,
} from "lucide-react";
import { FC, useState } from "react";
import { trpc } from "../_trpc/client";
import { convertDate, convertToMB } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { TRPCClientError } from "@trpc/client";
import { toast } from "@/components/ui/use-toast";
interface PanelDetailsProps {}

const PanelDetails: FC<PanelDetailsProps> = ({}) => {
  const [open, setOpen] = useState<boolean>(false);

  const [files, setFiles] = useState<FileObject[]>([]);
  const { mutateAsync: createFolder, isLoading } =
    trpc.folders.createFolder.useMutation();
  const { mutateAsync: removeFolder } = trpc.folders.removeFolder.useMutation();
  const { data, refetch } = trpc.folders.getUserFolders.useQuery();

  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const removeFile = (id: string) => {
    const filteredArray = files.filter((file) => file.id !== id);
    setFiles(filteredArray);
  };

  const handleCreateFolder = async () => {
    let filesArray: {
      name: string;
      fileBuffer: string;
      type: string;
      size: number;
    }[] = [];

    for (const file of files) {
      const arrayBuffer = await file.file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      filesArray.push({
        name: file.name,
        fileBuffer: base64,
        type: file.file.type,
        size: file.file.size,
      });
    }

    const base64res = await fetch(
      `data:${filesArray[0].type};base64,${filesArray[0].fileBuffer}`
    );
    const blob = await base64res.blob();
    console.log(URL.createObjectURL(blob));

    try {
      const created = await createFolder({
        name,
        password,
        files: filesArray,
      });
      if (created) {
        refetch();
        setOpen(false);
      }
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast({
          title:
            e.message === "PAYLOAD_TOO_LARGE"
              ? "Account limit reached."
              : "Error",
          description:
            e.message === "PAYLOAD_TOO_LARGE"
              ? " Max 20MB per account."
              : undefined,
          variant: "destructive",
        });
      }
    }
  };

  const getTotalSize = () => {
    let totalSize: number = 0;
    if (data) {
      for (const folder of data) {
        for (const file of folder.files) {
          totalSize += file.size;
        }
      }
    }
    return convertToMB(totalSize);
  };

  const handleRemoveFolder = async (id: string) => {
    const removed = await removeFolder(id);
    if (removed) {
      refetch();
    }
  };

  return (
    <>
      <div className="mt-8 max-w-md p-6 border-2 rounded-xl border-primary">
        <div className="flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-extrabold tracking-tighter">
            Total size.
          </h1>
          <h1 className="font-bold text-2xl">
            {getTotalSize()}MB
            <span className="text-muted-foreground md:text-lg text-sm ml-2">
              /20MB
            </span>
          </h1>
        </div>
        <h1 className="mt-2 text-muted-foreground text-sm inline-flex gap-1 items-center">
          <FileWarning className="h-6 w-6" /> You can't create the folder if you
          exceed the limit.
        </h1>
        <Progress
          value={Math.round((getTotalSize() / 20) * 100)}
          className="mt-2"
        />
      </div>
      <div className="flex gap-6 items-center  mt-12">
        <h1 className="text-lg md:text-2xl font-extrabold tracking-tighter">
          Your folders.
        </h1>
        <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
          <DialogTrigger asChild>
            <Button size="sm">Create new folder</Button>
          </DialogTrigger>
          <DialogContent>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Label htmlFor="password">Secret Code</Label>
            <Input
              id="password"
              name="password"
              maxLength={4}
              autoComplete="off"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FileDropArea files={files} setFiles={setFiles} />
            <ScrollArea className="h-40 w-full">
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-xl flex items-center border p-4"
                  >
                    <File className="h-8 w-8 mr-2" />
                    <h1 className="flex-1 truncate">{file.name}</h1>
                    <Button
                      className="shrink-0"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button
              disabled={
                files.length > 0 && password.length > 3 ? isLoading : true
              }
              onClick={() => handleCreateFolder()}
            >
              {isLoading ? (
                <Loader2 className=" h-5 w-5 animate-spin" />
              ) : (
                "Create folder"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid xl:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2  my-4 gap-2">
        {data?.map((item) => (
          <div
            key={item.id}
            className="border p-6 rounded-xl flex flex-col items-center gap-2 select-none"
          >
            <Building2 className="h-12 w-12" />
            <div className="flex flex-col items-start">
              <p className="text-muted-foreground text-sm">
                {convertDate(item.createdAt)}
              </p>
              <h1>{item.name}</h1>
              <h1 className="text-xs text-muted-foreground">
                {convertToMB(
                  item.files.reduce((total, file) => (total += file.size), 0)
                ) === 0
                  ? "0.01>"
                  : convertToMB(
                      item.files.reduce(
                        (total, file) => (total += file.size),
                        0
                      )
                    )}{" "}
                MB
              </h1>
            </div>
            <div className="flex gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Eye />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>Pin</DialogHeader>
                  <DialogDescription>
                    Hover cursor over the blurred field to reveal the pin.
                  </DialogDescription>
                  <div className="relative hover:border-primary border flex justify-center items-center h-40 transition-colors">
                    <div className="backdrop-blur-md hover:backdrop-blur-0 absolute inset-0 " />
                    <h1 className="text-2xl">{item.password}</h1>
                  </div>
                </DialogContent>
              </Dialog>
              <AlertDialog key={item.id}>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="destructive">
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>
                    Do you really want to delete the folder?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You can't restore the deleted folder with its files.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRemoveFolder(item.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {data?.length === 0 && (
          <span className="text-muted-foreground text-xl">No folders</span>
        )}
      </div>
    </>
  );
};

export default PanelDetails;

// {/* <div
// key={item.id}
// className="border p-6 rounded-xl flex flex-col items-center gap-4  group relative"
// >
// <div className="group-hover:bg-red-800/80 absolute inset-0 rounded-xl flex items-center justify-center transition-all">
//   <Trash2 className="h-16 w-16 group-hover:opacity-100 opacity-0 transition-opacity" />
// </div>
// <Building2 className="h-16 w-16" />
// <div className="flex flex-col items-start">
//   <p className="text-muted-foreground text-sm">klasa 6</p>
//   <p className="text-muted-foreground text-sm">
//     {/* {convertDate(item.createdAt)} */}
//   </p>
//   <h1>{item.name}</h1>
// </div>
// </div> */}
