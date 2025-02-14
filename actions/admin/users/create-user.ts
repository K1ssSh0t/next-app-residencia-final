"use server";

import { db } from "@/lib/db";
import { users } from "@/schema/users";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import bcrypt from "bcrypt";
import { z } from "zod";
import { isConsultor, isUser } from "@/services/authorization-service";

const insertUserSchema = createInsertSchema(users).extend({
  nivelEducativo: z.boolean(),
});

export interface CreateUserState extends BaseActionState {
  errors?: {
    id?: string[];
    name?: string[];
    email?: string[];
    // emailVerified?: string[];
    image?: string[];
    role?: string[];
    password?: string[];
    nivelEducativo?: string[];
    correoContacto?: string[];
    nombreContacto?: string[];
  };
}

export async function createUser(
  prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }
    // Este codigo verifica si el usuario autenticado es un usuario regular o un consultor
    // Si cumple cualquiera de esas condiciones, arroja un error de "unauthorized"
    // Es decir, solo permite continuar si el usuario tiene rol de administrador o consultor
    if (isUser(session) || isConsultor(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = insertUserSchema.safeParse({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      //emailVerified: new Date(formData.get("emailVerified") as string),
      image: formData.get("image") as string,
      role: formData.get("role") as string,
      password: formData.get("password") as string,
      nivelEducativo: formData.get("nivelEducativo") === "true",
      correoContacto: formData.get("correoContacto") as string,
      nombreContacto: formData.get("nombreContacto") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    const hash = bcrypt.hashSync(validatedFields.data.password as string, 10);
    validatedFields.data.password = hash;

    await db.insert(users).values(validatedFields.data);

    revalidatePath("/admin/users");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }

  redirect("/admin/users");
}
