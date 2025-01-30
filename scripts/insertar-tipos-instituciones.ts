import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { openConnection } from "./sdb";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // Tipos a insertar (respeta mayúsculas y formato solicitado)
    const tipos = [{ descripcion: "Publica" }, { descripcion: "Privada" }];

    // Verificar existencia previa
    const existentes = await sdb
      .select({ descripcion: tipoInstituciones.descripcion })
      .from(tipoInstituciones);

    const existentesSet = new Set(existentes.map((t) => t.descripcion));

    // Filtrar nuevos registros
    const nuevos = tipos.filter((t) => !existentesSet.has(t.descripcion));

    // Ejecutar inserción
    if (nuevos.length > 0) {
      await sdb.insert(tipoInstituciones).values(nuevos);
      console.log(`Tipos insertados (${nuevos.length}):`);
      console.log(nuevos.map((t) => t.descripcion).join("\n"));
    } else {
      console.log("Los tipos ya existen en la base de datos");
    }
  } catch (error) {
    console.error("Error en la inserción:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);
