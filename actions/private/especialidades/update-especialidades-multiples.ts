"use server";

import { db } from "@/lib/db";
import { BaseActionState } from "@/lib/types";
import { especialidades } from "@/schema/especialidades";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface UpdateEspecialidadState extends BaseActionState {
  errors?: {
    id?: string[];
    nombreEspecialidad?: string[];
    hombres?: string[];
    mujeres?: string[];
    cuestionarioId?: string[];
  };
}

export async function updateEspecialidadesMultiples(
  prevState: UpdateEspecialidadState,
  formData: FormData
): Promise<UpdateEspecialidadState> {
  try {
    // Handle existing especialidades updates
    const existingUpdates = [];
    const newEntries = [];

    for (const [key, value] of formData.entries()) {
      // Process existing entries
      if (key.startsWith("id-")) {
        const index = key.split("-")[1];
        existingUpdates.push({
          id: formData.get(`id-${index}`),
          nombreEspecialidad: formData.get(`nombreEspecialidad-${index}`),
          hombres: parseInt(formData.get(`hombres-${index}`) as string),
          mujeres: parseInt(formData.get(`mujeres-${index}`) as string),
          cuestionarioId: formData.get(`cuestionarioId-${index}`),
        });
      }
      // Process new entries
      else if (key.startsWith("new-nombreEspecialidad-")) {
        const index = key.split("-")[2];
        newEntries.push({
          nombreEspecialidad: formData.get(`new-nombreEspecialidad-${index}`),
          hombres: parseInt(formData.get(`new-hombres-${index}`) as string),
          mujeres: parseInt(formData.get(`new-mujeres-${index}`) as string),
          cuestionarioId: formData.get(`new-cuestionarioId-${index}`),
        });
      }
    }

    // Update existing records
    for (const update of existingUpdates) {
      const { id, ...updateData } = update;
      await db
        .update(especialidades)
        .set({
          nombreEspecialidad: String(updateData.nombreEspecialidad),
          hombres: updateData.hombres,
          mujeres: updateData.mujeres,
          cuestionarioId: String(updateData.cuestionarioId),
        })
        .where(eq(especialidades.id, String(id)));
    }

    // Insert new records
    for (const entry of newEntries) {
      if (entry.nombreEspecialidad) {
        await db.insert(especialidades).values({
          nombreEspecialidad: String(entry.nombreEspecialidad),
          hombres: entry.hombres,
          mujeres: entry.mujeres,
          cuestionarioId: String(entry.cuestionarioId),
        });
      }
    }

    revalidatePath("/datos-especialidades");
    return { message: "Datos actualizados correctamente" };
  } catch (error) {
    return { status: "error" };
  }
}
