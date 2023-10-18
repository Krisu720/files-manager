"use client";

import { FC, useState } from "react";
import CodeInput from "@/components/CodeInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import useMounted from "@/hooks/use-mounted";
interface PasswordDialogProps {}

const PasswordDialog: FC<PasswordDialogProps> = ({}) => {
  const mounted = useMounted()

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
  return mounted ? (
      <Dialog defaultOpen>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wpisz kod dostępu.</DialogTitle>
            <DialogDescription>
              Wpisz kod dostępu, aby dostać się do plików.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-evenly w-full my-2">
            <CodeInput value={value} setValue={setValue} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Wróć</Button>
            </DialogClose>
            <Button disabled={checkLength()}>Dalej</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  ) : <></>;
};

export default PasswordDialog;
