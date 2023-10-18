"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Form, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../_trpc/client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const Page = () => {

  const router = useRouter()

  const { mutateAsync, isLoading, error, status } =
    trpc.account.createAccount.useMutation();

  const LoginValidator = z.object({
    email: z
      .string()
      .min(1, { message: "Email required." })
      .max(99, { message: "Email is too long." }),
    password: z
      .string()
      .min(1, { message: "Password required." })
      .max(99, { message: "Password is too long." }),
    name: z
      .string()
      .min(1, { message: "Name required." })
      .max(99, { message: "Name is too long." }),
    surname: z
      .string()
      .min(1, { message: "Surname required." })
      .max(99, { message: "Surname is too long." }),
  });

  useEffect(() => {
    if (status === "error") {
      toast({ title: error.message, variant: "destructive" });
    } else if (status === "success") {
      toast({ title: "Account has been created." });
    }
  }, [status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginValidator>>({
    resolver: zodResolver(LoginValidator),
  });

  const submitHandler: SubmitHandler<z.infer<typeof LoginValidator>> = async (
    data
  ) => {
    const { email, password, name, surname } = data;
    const signed = await mutateAsync({ email, password, name, surname });

    if (signed) {
      router.push("/login")
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="max-w-sm w-full flex flex-col  absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <LogIn />
          <h1 className="text-2xl font-bold">Sign up</h1>
          <p className="text-muted-foreground">
            Provide your data to create a new account.
          </p>
        </div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          className="mt-1"
          {...register("email")}
        />
        {errors.email?.message && <span>{errors.email.message}</span>}
        <Label htmlFor="password" className="mt-4">
          Name
        </Label>
        <Input
          id="password"
          type="text"
          className="mt-1"
          {...register("name")}
        />
        {errors.name?.message && <span>{errors.name.message}</span>}
        <Label htmlFor="password" className="mt-4">
          Surname
        </Label>
        <Input
          id="password"
          type="text"
          className="mt-1"
          {...register("surname")}
        />
        {errors.surname?.message && <span>{errors.surname.message}</span>}
        <Label htmlFor="password" className="mt-4">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          className="mt-1"
          {...register("password")}
        />
        {errors.password?.message && <span>{errors.password.message}</span>}
        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create new account"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Page;
