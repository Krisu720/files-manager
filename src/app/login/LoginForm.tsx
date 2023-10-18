"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { FC, useState } from "react";
import { Form, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = ({}) => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState<boolean>(false);

  const LoginValidator = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .max(99, { message: "Email is too long." }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .max(99, { message: "Password is too long." }),
  });

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
    setLoading(true);
    const { email, password } = data;
    await signIn("credentials", { email, password });
    setLoading(false);
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="max-w-sm w-full flex flex-col absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
    >
      <div className="flex flex-col items-center gap-2 mb-4">
        <LogIn />
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="text-muted-foreground">
          Provide your data to log in to your account.
        </p>
      </div>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" className="mt-1" {...register("email")} />
      {errors.email?.message && <span>{errors.email.message}</span>}
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
      {error && (
        <Alert variant="destructive" className="my-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error === "CredentialsSignin" ? "Wrong email or password." : "Error occured."}</AlertDescription>
        </Alert>
      )}
      <Button className="mt-2" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
      </Button>
      <Link href="/register" className={cn(buttonVariants({className:"mt-6",variant: "link"}))}>Dont have an account? Sign up!</Link>
    </form>
  );
};

export default LoginForm;
