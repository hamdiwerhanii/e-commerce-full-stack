import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useLoginMutation } from "@/api/auth.api";
import { Button } from "@/shared/components/Button";
import { fieldAria, FormField } from "@/shared/components/FormField";
import { Input } from "@/shared/components/Input";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { LoginInput } from "@/types";
import { useServerErrors } from "../hooks/useServerErrors";
import { loginSchema } from "../schemas/authSchemas";

export function LoginRoot() {
  useDocumentTitle("Sign in");
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onServerError = useServerErrors(setError);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await login(values).unwrap();
      toast.success(`Welcome back, ${user.userName}!`);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? (user.role === "admin" ? "/admin/dashboard" : "/shop/home"), {
        replace: true,
      });
    } catch (error) {
      onServerError(error);
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign in to your account</h1>
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            {...fieldAria("email", errors.email?.message)}
            {...register("email")}
          />
        </FormField>
        <FormField id="password" label="Password" error={errors.password?.message}>
          <Input
            type="password"
            autoComplete="current-password"
            {...fieldAria("password", errors.password?.message)}
            {...register("password")}
          />
        </FormField>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
