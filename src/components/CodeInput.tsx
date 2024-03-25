import useMounted from "@/hooks/use-mounted";
import { useEffect, useRef } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
const CodeInput = ({
  onComplete,
  isError,
}: {
  isError: boolean;
  onComplete: (password: string) => void;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const formSchema = z.object({
    pin: z.string(),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  if (isError) {
    form.setValue("pin", "");
  }
  const onCompleteHandle = () => {
    if (formRef.current) formRef.current.requestSubmit();
  };

  const handleSubmit = async (data: FormSchema) => {
    onComplete(data.pin);
  };

  return (
    <Form {...form} >

      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP
                  autoFocus
                  maxLength={4}
                  onComplete={onCompleteHandle}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} />
                      ))}{" "}
                    </InputOTPGroup>
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CodeInput;
