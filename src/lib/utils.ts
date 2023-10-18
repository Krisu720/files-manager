import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertDate = (DateString: Date) => {
  const data = new Date(DateString.toString());
  return data.toLocaleDateString();
};

export const convertToMB = (bytes:number) => {
  return Math.round((bytes/1024/1024)*100)/100
}
