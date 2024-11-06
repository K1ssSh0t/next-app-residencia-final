"use server";

import { db } from "@/lib/db";
import { users } from "@/schema/users";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertUserSchema = createInsertSchema(users);

export interface CreateUserState extends BaseActionState {
  errors?: {
    id?: string[];
    name?: string[];
    email?: string[];
    emailVerified?: string[];
    image?: string[];
    role?: string[];
    password?: string[];
  };
}

export async function createUser(
  prevState: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }


    const validatedFields = insertUserSchema.safeParse({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      emailVerified: new Date(formData.get("emailVerified") as string),
      image: formData.get("image") as string,
      role: formData.get("role") as string,
      password: formData.get("password") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(users).values(validatedFields.data);
    
    revalidatePath("/admin/users");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/users");
}