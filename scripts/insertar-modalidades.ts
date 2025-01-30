import { modalidades } from "@/schema/modalidads";
import { openConnection } from "./sdb";
import { eq } from "drizzle-orm";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // Datos a insertar
    const modalidadesData = [
      { descripcion: "Escolarizada" },
      { descripcion: "No escolarizada" },
      { descripcion: "Mixta" },
    ];

    // Verificar duplicados
    const existingModalidades = await sdb
      .select({ descripcion: modalidades.descripcion })
      .from(modalidades);

    const existingDescriptions = new Set(
      existingModalidades.map((m) => m.descripcion)
    );

    // Filtrar nuevas modalidades
    const nuevasModalidades = modalidadesData.filter(
      (m) => !existingDescriptions.has(m.descripcion)
    );

    // Insertar si hay nuevas
    if (nuevasModalidades.length > 0) {
      await sdb.insert(modalidades).values(nuevasModalidades);
      console.log(`Insertadas ${nuevasModalidades.length} modalidades:`);
      console.log(nuevasModalidades.map((m) => m.descripcion).join(", "));
    } else {
      console.log("Todas las modalidades ya existen en la base de datos");
    }
  } catch (error) {
    console.error("Error insertando modalidades:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);
