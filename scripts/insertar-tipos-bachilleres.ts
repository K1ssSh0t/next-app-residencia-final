import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { openConnection } from "./sdb";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // Tipos de bachilleres a insertar
    const tipos = [{ descripcion: "General" }, { descripcion: "Tecnologico" }];

    // Verificar registros existentes
    const existingTipos = await sdb
      .select({ descripcion: tipoBachilleres.descripcion })
      .from(tipoBachilleres);

    const existingDescriptions = new Set(
      existingTipos.map((t) => t.descripcion)
    );

    // Filtrar nuevos registros
    const nuevosTipos = tipos.filter(
      (t) => !existingDescriptions.has(t.descripcion)
    );

    // Insertar si hay nuevos
    if (nuevosTipos.length > 0) {
      await sdb.insert(tipoBachilleres).values(nuevosTipos);
      console.log(`Tipos insertados (${nuevosTipos.length}):`);
      console.log(nuevosTipos.map((t) => t.descripcion).join("\n"));
    } else {
      console.log("Ambos tipos ya existen en la base de datos");
    }
  } catch (error) {
    console.error("Error insertando tipos de bachilleres:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);
