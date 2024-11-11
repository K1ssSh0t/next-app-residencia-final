"use server";

import { db } from "@/lib/db";
import { helpers } from "@/schema/helpers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteHelperSchema = createSelectSchema(helpers).pick({ id: true });

export interface DeleteHelperState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteHelper(
  prevState: DeleteHelperState,
  formData: FormData
): Promise<DeleteHelperState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteHelperSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(helpers).where(eq(helpers.id, validatedFields.data.id));
    
    revalidatePath("/admin/helpers");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/helpers");
}
