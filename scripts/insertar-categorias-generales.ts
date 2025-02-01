import { categoriasGenerales } from "@/schema/categorias-generales";
import { openConnection } from "./sdb";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // Datos requeridos (manteniendo formato y mayúsculas exactas)
    const categorias = [
      { descripcion: "Directivos General" },
      { descripcion: "Administrativos General" },
      { descripcion: "Docentes General" },
      { descripcion: "Monto Asignado a Infraestructura" },
    ];

    // Verificar existencia previa
    const existentes = await sdb
      .select({ descripcion: categoriasGenerales.descripcion })
      .from(categoriasGenerales);

    const existentesSet = new Set(existentes.map((c) => c.descripcion));

    // Filtrar nuevas categorías
    const nuevasCategorias = categorias.filter(
      (c) => !existentesSet.has(c.descripcion)
    );

    // Insertar solo registros nuevos
    if (nuevasCategorias.length > 0) {
      await sdb.insert(categoriasGenerales).values(nuevasCategorias);
      console.log(`Categorías insertadas (${nuevasCategorias.length}):`);
      console.log(nuevasCategorias.map((c) => c.descripcion).join("\n"));
    } else {
      console.log("Todas las categorías generales ya están registradas");
    }
  } catch (error) {
    console.error("Error insertando categorías:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);
