import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NotFound = ({}) => {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="max-w-3xl flex flex-col gap-3">
        <h1 className="text-3xl font-extrabold tracking-tighter">
          Nie znaleziono pliku
        </h1>
        <p>
          Nie znaleźliśmy plików przypisanych do tego linku. Prawdopodobnie
          zostały one usunięte.
        </p>
        <Link href="/" className={cn(buttonVariants())}>
          Powrót do strony głównej
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
