import type z from "zod";
import { signUpFormSchema } from "./auth-form-schemas";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { pwnedPassword } from "hibp";

interface SignUpFormProps {
  setSelectedTab: (tab: "login" | "signup") => void;
}

const SignUpForm = ({ setSelectedTab }: SignUpFormProps) => {

  const { signUp } = useAuth();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    },
  })

  const isPasswordSafe = async (password: string) => {
    const pwnedCount = await pwnedPassword(password);

    if (pwnedCount > 0) {
      form.setError("password", {
        type: "manual",
        message: "Password is too common"
      });
      return false;
    }

    return true;
  }

  async function onSubmit(data: z.infer<typeof signUpFormSchema>) {

    const isSafe = await isPasswordSafe(data.password);
    if(!isSafe) {
      return;
    }    

    // Not pwned, proceed with signup
    signUp(
      { email: data.email, username: data.username, password: data.password },
      () => setSelectedTab('login')
    );
  }

  return (
    <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Choose a username and create a new account
          </p>
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-signup-email">
                Email
              </FieldLabel>
              <Input
                {...field}
                id="form-signup-email"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                required
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-signup-username">
                Username
              </FieldLabel>
              <Input
                {...field}
                id="form-signup-username"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                required
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="form-signup-password">
                  Password
                </FieldLabel>
              </div>
              <Input
                {...field}
                id="form-signup-password"
                type="password"
                required
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="form-signup-confirmPassword">
                  Confirm password
                </FieldLabel>
              </div>
              <Input
                {...field}
                id="form-signup-confirmPassword"
                type="password"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Field>
          <Button type="submit">
            Signup
          </Button>
        </Field>

      </FieldGroup>
    </form >
  )
};
export default SignUpForm;