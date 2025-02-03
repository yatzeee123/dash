import { Form, Link, redirect, useNavigation } from "react-router";
import { validateEmail, validatePassword } from "~/validation";
import { createClient } from "~/supabase.server";
import { commitSession, getSession, setSuccessMessage } from "~/session.server";
import type { Route } from "./+types/signup";

interface FieldError {
  email?: string;
  password?: string;
}

export async function action({ request }: Route.ActionArgs) {
  let session = await getSession(request.headers.get("Cookie"));

  let formData = await request.formData();
  let email = String(formData.get("email"));
  let password = String(formData.get("password"));

  let fieldErrors: FieldError = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  // Return errors if any

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  // Sign up user

  let { supabase, headers } = createClient(request);
  let { data: userData, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw error;
  }

  if (userData) {
    setSuccessMessage(session, "Check your email to verify your account!");
    let allHeaders = {
      ...Object.fromEntries(headers.entries()),
      "Set-Cookie": await commitSession(session),
    };

    throw redirect("/", {
      headers: allHeaders,
    });
  }
  return null;
}

export default function Signup({ actionData }: Route.ComponentProps) {
  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";

  return (
    <main className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:h-screen px-6 xl:max-w-6xl mx-auto">
      <div className="lg:self-center">
        <h1 className="text-4xl font-semibold">Signup</h1>
        <Form method="post" className="mt-8 space-y-4">
          <div>
            <label htmlFor="email">
              Email{" "}
              {actionData?.fieldErrors?.email ? (
                <span className="text-red-500">
                  {actionData.fieldErrors.email}
                </span>
              ) : null}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              className={`px-4 py-2 rounded-md block mt-2 w-full border ${
                actionData?.fieldErrors?.email ? "border-red-500" : ""
              }`}
            />
          </div>

          <div>
            <label htmlFor="password">
              Password{" "}
              {actionData?.fieldErrors?.password ? (
                <span className="text-red-500">
                  {actionData.fieldErrors.password}
                </span>
              ) : null}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              className={`px-4 py-2 rounded-md block mt-2 w-full border ${
                actionData?.fieldErrors?.password ? "border-red-500" : ""
              }`}
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 transition ease-in-out duration-300 px-4 py-2 rounded-md active:scale-[.97]"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </Form>
        <Link
          to="/login"
          className="mt-4 text-gray-300 inline-block hover:underline"
        >
          Have an account? Log in instead
        </Link>
      </div>
      <div>
        <img
          src="https://images.unsplash.com/photo-1463171379579-3fdfb86d6285?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="A person using a computer"
          className="w-full h-full rounded-lg object-cover"
        />
      </div>
    </main>
  );
}
