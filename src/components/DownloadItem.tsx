"use client";

import { cn, convertToMB } from "@/lib/utils";
import { File } from "@prisma/client";
import {
  Download,
  Eye,
  File as FileIcon,
  FileText,
  Loader2,
  Text,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const DownloadItem = ({
  file,
  setPreview,
}: {
  file: File;
  setPreview: React.Dispatch<
    React.SetStateAction<{
      type: "pdf" | "image";
      data: string;
      name: string;
    } | null>
  >;
}) => {
  const [clicked, setClicked] = useState<boolean>(false);

  const downloadFile = async (name: string, type: string, base64: string) => {
    setClicked(true);
    const base64res = await fetch(`data:${type};base64,${base64}`);
    const blob = await base64res.blob();
    const temporary = document.createElement("a");
    temporary.setAttribute("download", name);
    const url = URL.createObjectURL(blob);
    temporary.setAttribute("href", url);
    temporary.setAttribute("target", "_blank");
    temporary.click();
    URL.revokeObjectURL(url);
    setClicked(false);
  };

  const fileType = file.type === "application/pdf" || file.type.startsWith("image")
  

  return (
    <div className="border flex flex-col items-center rounded-xl disabled:opacity-25 disabled:hover:bg-transparent">
      <div className=" p-6 flex flex-col items-center gap-4">
        {clicked ? (
          <Loader2 className="h-16 w-16 animate-spin" />
        ) : file.type.startsWith("image") ? (
          <motion.img
            layoutId={file.name}
            className="h-16 w-16"
            src={`data:${file.type};base64,${file.base64}`}
            alt="preview"
          />
        ) : file.type.startsWith("text") ? (
          <Text className="h-16 w-16" />
        ) : file.type.startsWith("application/") ? (
          <FileText className="h-16 w-16" />
        ) : (
          <FileIcon className="h-16 w-16" />
        )}

        <h1 className="text-xs text-muted-foreground">
          {convertToMB(file.size) === 0 ? "0.01>" : convertToMB(file.size)} MB
        </h1>
        <h1 className="break-all mt-auto text-sm">{file.name}</h1>
      </div>
      <div className="flex h-14 w-full ">
        <button
          className={cn("flex-1 flex items-center justify-center hover:bg-secondary rounded-bl-lg", !fileType && "rounded-b-lg")}
          onClick={() => downloadFile(file.name, file.type, file.base64)}
        >
          <Download />
        </button>
        {fileType && (
            <button
              className="flex-1 flex items-center justify-center hover:bg-secondary rounded-br-lg"
              onClick={() =>
                setPreview({
                  type: file.type === "application/pdf" ? "pdf" : "image",
                  data: `data:${file.type};base64,${file.base64}`,
                  name: file.name,
                })
              }
            >
              <Eye />
            </button>
          )}
      </div>
    </div>
  );
};

export default DownloadItem;
