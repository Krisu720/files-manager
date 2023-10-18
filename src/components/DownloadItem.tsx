"use client";

import { convertToMB } from "@/lib/utils";
import { File } from "@prisma/client";
import { File as FileIcon, FileText, Loader2, Text } from "lucide-react";
import ImageNext from "next/image";
import { useState } from "react";

const DownloadItem = ({ file }: { file: File }) => {
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

  return (
    <button
      disabled={clicked}
      className="border p-6 rounded-xl flex flex-col items-center gap-4 hover:bg-secondary disabled:opacity-25 disabled:hover:bg-transparent"
      onClick={() => downloadFile(file.name, file.type, file.base64)}
    >
      {clicked ? (
        <Loader2 className="h-16 w-16 animate-spin" />
      ) : file.type.startsWith("image") ? (
        <div className="relative h-16 w-16">
          {" "}
          <ImageNext
            className="object-contain"
            src={`data:${file.type};base64,${file.base64}`}
            fill
            alt="preview"
          />{" "}
        </div>
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
    </button>
  );
};

export default DownloadItem;
