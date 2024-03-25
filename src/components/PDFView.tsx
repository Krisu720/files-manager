"use client";

import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useElementSize } from "@mantine/hooks";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PDFView = ({ base64 }: { base64: string }) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const [width, setWidth] = useState<number>(window.innerWidth < 660 ? window.innerWidth : 660);
  const changeWidth = () => {
    if(window.innerWidth < 660) setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", () => changeWidth());
    return () => {
      window.removeEventListener("resize", () => changeWidth());
    };
  }, []);

  console.log(width);
  // const { ref, width } = useElementSize();
  return (
    <div className="flex flex-col">
      <Document
        file={base64}
        onLoadSuccess={(e) => setNumPages(e.numPages)}
        className="max-w-full w-full"
      >
        <Page pageNumber={page} width={width} />
      </Document>
      <div className="flex justify-between mt-4 px-12">
        <Button
          onClick={() => setPage((prev) => (prev - 1 < 1 ? prev : prev - 1))}
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={() =>
            setPage((prev) => (prev + 1 <= numPages ? prev + 1 : prev))
          }
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default PDFView;
