"use server";

import { db } from "@/lib/db";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteTipoBachillereSchema = createSelectSchema(tipoBachilleres).pick({ id: true });

export interface DeleteTipoBachillereState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteTipoBachillere(
  prevState: DeleteTipoBachillereState,
  formData: FormData
): Promise<DeleteTipoBachillereState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteTipoBachillereSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(tipoBachilleres).where(eq(tipoBachilleres.id, validatedFields.data.id));
    
    revalidatePath("/admin/tipo-bachilleres");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/tipo-bachilleres");
}
