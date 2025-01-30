import { municipios } from "@/schema/municipios";
import { regiones } from "@/schema/regions";
import { openConnection } from "./sdb";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // Precargar todas las regiones en un mapa para eficiencia
    const allRegiones = await sdb
      .select({
        id: regiones.id,
        nombre: regiones.nombre,
      })
      .from(regiones);

    const regionMap = new Map(
      allRegiones.map((region) => [region.nombre, region.id])
    );
    console.log(`Loaded ${regionMap.size} regions`);

    // Leer y parsear el CSV
    const csvPath = path.join(__dirname, "municipios.csv");
    const fileContent = fs.readFileSync(csvPath, { encoding: "utf-8" });

    const municipiosData = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value: string) => value.trim(), // Limpiar espacios
    }).filter(
      (record: any) => record.cve_mun && record.cve_mun !== "cve_mun" // Filtrar encabezados
    );

    // Procesar registros
    const municipiosToInsert = [];
    let skipped = 0;

    for (const record of municipiosData) {
      // Validar nombres de columnas (ajustar según CSV real)
      const regionNombre = record.Region; // Asegurar que coincida con el CSV
      const nombreMunicipio = record.nom_mun;

      if (!regionNombre || !nombreMunicipio) {
        console.error("Registro inválido:", record);
        skipped++;
        continue;
      }

      const regionId = regionMap.get(regionNombre);
      if (!regionId) {
        console.error(`Región no encontrada: ${regionNombre}`);
        skipped++;
        continue;
      }

      municipiosToInsert.push({
        nombre: nombreMunicipio,
        regionId: regionId, // Usar nombre de campo según esquema (regionId)
      });
    }

    // Insertar en lote
    if (municipiosToInsert.length > 0) {
      await sdb.insert(municipios).values(municipiosToInsert);
      console.log(
        `Insertados ${municipiosToInsert.length} municipios. Omitidos: ${skipped}`
      );
    } else {
      console.log("No hay municipios para insertar");
    }
  } catch (error) {
    console.error("Error crítico:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);
