"use server";

import { db } from "@/lib/db";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isUser, isConsultor } from "@/services/authorization-service";

const insertTipoBachillereSchema = createInsertSchema(tipoBachilleres);

export interface CreateTipoBachillereState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function createTipoBachillere(
  prevState: CreateTipoBachillereState,
  formData: FormData,
): Promise<CreateTipoBachillereState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (isUser(session) || isConsultor(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = insertTipoBachillereSchema.safeParse({
      descripcion: formData.get("descripcion") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(tipoBachilleres).values(validatedFields.data);

    revalidatePath("/admin/tipo-bachilleres");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }

  redirect("/admin/tipo-bachilleres");
}
