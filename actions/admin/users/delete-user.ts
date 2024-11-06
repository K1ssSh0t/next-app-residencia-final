"use server";

import { db } from "@/lib/db";
import { users } from "@/schema/users";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteUserSchema = createSelectSchema(users).pick({ id: true });

export interface DeleteUserState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteUser(
  prevState: DeleteUserState,
  formData: FormData
): Promise<DeleteUserState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteUserSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(users).where(eq(users.id, validatedFields.data.id));
    
    revalidatePath("/admin/users");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/users");
}
