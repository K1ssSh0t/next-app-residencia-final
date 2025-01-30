import { regiones } from "@/schema/regions";
import { openConnection } from "./sdb";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // Regiones oficiales de Oaxaca
    const regionesOaxaca = [
      "Valles Centrales",
      "Sierra Norte",
      "Sierra Sur",
      "Mixteca",
      "Cañada",
      "Papaloapan",
      "Istmo",
      "Costa",
    ].map((nombre) => ({ nombre }));

    // Verificar duplicados
    const existingRegiones = await sdb
      .select({ nombre: regiones.nombre })
      .from(regiones);

    const existingNombres = new Set(existingRegiones.map((r) => r.nombre));

    // Filtrar regiones nuevas
    const nuevasRegiones = regionesOaxaca.filter(
      (r) => !existingNombres.has(r.nombre)
    );

    // Insertar si hay nuevas
    if (nuevasRegiones.length > 0) {
      await sdb.insert(regiones).values(nuevasRegiones);
      console.log(`Regiones insertadas (${nuevasRegiones.length}):`);
      console.log(nuevasRegiones.map((r) => r.nombre).join("\n"));
    } else {
      console.log("Todas las regiones ya están registradas");
    }
  } catch (error) {
    console.error("Error insertando regiones:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);
