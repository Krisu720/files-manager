"use client";

import { FC, SetStateAction } from "react";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FileObject = {
  id: string;
  name: string;
  file: File;
};

interface FileDropAreaProps {
  className?: string;
  files: FileObject[];
  setFiles: React.Dispatch<SetStateAction<FileObject[]>>;
}

const FileDropArea: FC<FileDropAreaProps> = ({
  className,
  files,
  setFiles,
}) => {
  const [dragging, setDragging] = useState<boolean>(false);

  const fileInput = useRef<HTMLInputElement>(null);

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const dropFunc = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dt = e.dataTransfer.files;
    addFiles(dt);
    dragEnd();
  };

  const dragEnd = () => {
    setDragging(false);
  };

  const selectFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const dt = e.currentTarget.files;
    if (dt !== null) addFiles(dt);
  };

  const addFiles = (dt: FileList) => {
    let outputArray: FileObject[] = [];
    const arrayFile = [...dt];

    arrayFile.map((file) => {
      const id = uuidv4();
      const name = file.name;
      outputArray.push({ id, name, file });
    });
    setFiles((prev) => [...outputArray, ...prev]);
  };

  return (
    <div className={cn("w-full rounded-3xl p-3 flex flex-col", className)}>
      <div
        onDragOver={(e) => dragStart(e)}
        onDrop={(e) => dropFunc(e)}
        onDragLeaveCapture={() => dragEnd()}
        className={cn(
          dragging
            ? "border-solid border-primary dark:bg-neutral-900 bg-primary/10"
            : " border-dashed",
          "rounded-xl  flex flex-col items-center h-full justify-center w-full border-2 transition-colors"
        )}
      >
        <button
          className="text-sm text-primary h-full w-full p-4 flex flex-col justify-center items-center gap-2"
          onClick={() => fileInput.current?.click()}
          type="button"
        >
          <ImageIcon className="dark:text-white text-black" />
          Click and select files or drag them here
        </button>
        <input
          multiple
          hidden
          type="file"
          ref={fileInput}
          onChange={(e) => selectFunc(e)}
        />
      </div>
    </div>
  );
};

export default FileDropArea;
