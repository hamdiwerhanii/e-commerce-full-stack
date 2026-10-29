import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useRegisterMutation } from "@/api/auth.api";
import { Button } from "@/shared/components/Button";
import { fieldAria, FormField } from "@/shared/components/FormField";
import { Input } from "@/shared/components/Input";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { RegisterInput } from "@/types";
import { useServerErrors } from "../hooks/useServerErrors";
import { registerSchema } from "../schemas/authSchemas";

export function RegisterRoot() {
  useDocumentTitle("Create an account");
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { userName: "", email: "", password: "" },
  });
  const onServerError = useServerErrors(setError);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await registerUser(values).unwrap();
      toast.success(`Welcome, ${user.userName}! Your account is ready.`);
      navigate("/shop/home", { replace: true });
    } catch (error) {
      onServerError(error);
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create a new account</h1>
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <FormField id="userName" label="User name" error={errors.userName?.message}>
          <Input
            autoComplete="username"
            {...fieldAria("userName", errors.userName?.message)}
            {...register("userName")}
          />
        </FormField>
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            {...fieldAria("email", errors.email?.message)}
            {...register("email")}
          />
        </FormField>
        <FormField
          id="password"
          label="Password"
          hint="At least 8 characters with a letter and a number."
          error={errors.password?.message}
        >
          <Input
            type="password"
            autoComplete="new-password"
            {...fieldAria("password", errors.password?.message)}
            {...register("password")}
          />
        </FormField>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
