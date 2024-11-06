"use server";

import { db } from "@/lib/db";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateTipoBachillereSchema = createSelectSchema(tipoBachilleres).partial().required({ id: true });

export interface UpdateTipoBachillereState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function updateTipoBachillere(
  prevState: UpdateTipoBachillereState,
  formData: FormData
): Promise<UpdateTipoBachillereState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }


    const validatedFields = updateTipoBachillereSchema.safeParse({
      id: formData.get("id") as string,
      descripcion: formData.get("descripcion") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .update(tipoBachilleres)
      .set(validatedFields.data)
      .where(eq(tipoBachilleres.id, validatedFields.data.id));

    revalidatePath("/admin/tipo-bachilleres");
    revalidatePath("/admin/tipo-bachilleres/" + validatedFields.data.id);
    revalidatePath("/admin/tipo-bachilleres/" + validatedFields.data.id + "/edit");

    return {
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }
}
