import React from 'react'
import { AlertCircle, Loader2} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CodeInput from "@/components/CodeInput";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
type CodeDialogProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    getAccess: (password: string) => void;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
}
const CodeDialog = ({error,getAccess,isError,isLoading,open,setOpen}:CodeDialogProps) => {
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={(value) => setOpen(value)}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Enter the code</AlertDialogTitle>
        <AlertDialogDescription>
          Enter the code to access the files.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="flex justify-evenly w-full my-2">
        <CodeInput onComplete={getAccess} isError={isError} />
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center backdrop-blur-sm z-30">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>
      {error && (
        <Alert variant="destructive" className="my-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error === "UNAUTHORIZED" && "Wrong code."}
          </AlertDescription>
        </Alert>
      )}
      <AlertDialogFooter>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className=" mt-2 sm:mt-0"
        >
          Go back
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default CodeDialog