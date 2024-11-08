"use server";

import { db } from "@/lib/db";
import { users } from "@/schema/users";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import bcrypt from "bcrypt";
import { z } from "zod";

const updateUserSchema = createSelectSchema(users)
  .partial()
  .required({ id: true })
  .extend({
    nivelEducativo: z.boolean(),
  });

export interface UpdateUserState extends BaseActionState {
  errors?: {
    id?: string[];
    name?: string[];
    email?: string[];
    //emailVerified?: string[];
    image?: string[];
    role?: string[];
    password?: string[];
    nivelEducativo?: string[];
  };
}

export async function updateUser(
  prevState: UpdateUserState,
  formData: FormData
): Promise<UpdateUserState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = updateUserSchema.safeParse({
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      //emailVerified: new Date(formData.get("emailVerified") as string),
      image: formData.get("image") as string,
      role: formData.get("role") as string,
      password: formData.get("password") as string,
      nivelEducativo: formData.get("nivelEducativo") === "true",
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }
    // Remove password field if it's empty
    if (!validatedFields.data.password) {
      delete validatedFields.data.password;
    } else {
      // Only hash the password if it's not empty
      const hash = bcrypt.hashSync(validatedFields.data.password, 10);
      validatedFields.data.password = hash;
    }
    await db
      .update(users)
      .set(validatedFields.data)
      .where(eq(users.id, validatedFields.data.id));

    revalidatePath("/admin/users");
    revalidatePath("/admin/users/" + validatedFields.data.id);
    revalidatePath("/admin/users/" + validatedFields.data.id + "/edit");

    return {
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }
}
