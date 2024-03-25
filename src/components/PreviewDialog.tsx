import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Button } from "./ui/button";
import PDFView from "@/components/PDFView";
import { PreviewState } from "@/lib/types";
import { X } from "lucide-react";

const PreviewDialog = ({
  preview,
  setPreview,
}: {
  preview: PreviewState | null;
  setPreview: (preview: PreviewState | null) => void;
}) => {
  return (
    <AnimatePresence>
      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          onClick={
            preview.type === "image" ? () => setPreview(null) : undefined
          }
        >
          <Button
            className="absolute top-5 left-5 z-40 bg-black/10"
            variant="ghost"
            size="icon"
            onClick={() => setPreview(null)}
          >
            <X />
          </Button>
          {preview.type === "pdf" ? (
            <PDFView base64={preview.data} />
          ) : (
            <motion.img
              layoutId={preview.name}
              src={preview.data}
              alt="preview"
              className="h-full z-30"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewDialog;
