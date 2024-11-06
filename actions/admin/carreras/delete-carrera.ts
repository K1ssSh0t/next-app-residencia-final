"use server";

import { db } from "@/lib/db";
import { carreras } from "@/schema/carreras";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteCarreraSchema = createSelectSchema(carreras).pick({ id: true });

export interface DeleteCarreraState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteCarrera(
  prevState: DeleteCarreraState,
  formData: FormData
): Promise<DeleteCarreraState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteCarreraSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(carreras).where(eq(carreras.id, validatedFields.data.id));
    
    revalidatePath("/admin/carreras");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/carreras");
}
