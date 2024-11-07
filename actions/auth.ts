"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function authenticate(formData: FormData) {
  try {
    await signIn("credentials", {
      redirect: false, // Prevent automatic redirect
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    return { error: "An unexpected error occurred." };
  }
}
