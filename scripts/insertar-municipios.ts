import { municipios } from "@/schema/municipios";
import { regiones } from "@/schema/regions";
import { openConnection } from "./sdb";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // Read the CSV file
    const csvPath = path.join(__dirname, "municipios.csv");
    const fileContent = fs.readFileSync(csvPath, { encoding: "utf-8" });

    // Parse the CSV file synchronously
    const municipiosData = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        // Trim whitespace from all values
        return typeof value === "string" ? value.trim() : value;
      },
    })
      // Filter out header rows
      .filter((record: any) => record.cve_mun && record.cve_mun !== "cve_mun");

    // Prepare to store municipios with region IDs
    const municipiosToInsert = [];

    // Process each municipio
    for (const record of municipiosData) {
      // Find the region ID by name in the database
      const regionResult = await sdb
        .select({ id: regiones.id })
        .from(regiones)
        .where(eq(regiones.nombre, record.Region))
        .limit(1);

      if (regionResult.length === 0) {
        console.error(`Region not found: ${record.Region}`);
        continue;
      }

      // Add municipio with its region ID
      municipiosToInsert.push({
        cve_mun: record.cve_mun.toString(),
        nombre: record.nom_mun,
        region_id: regionResult[0].id,
        distrito: record.Distrito,
      });
    }

    // Insert municipios
    if (municipiosToInsert.length > 0) {
      await sdb.insert(municipios).values(municipiosToInsert);
      console.log(
        `Inserted ${municipiosToInsert.length} municipios into the database`
      );
    } else {
      console.log("No municipios to insert");
    }
  } catch (error) {
    console.error("Error inserting municipios:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);

// async function main() {
//   const { sdb, closeConnection } = await openConnection();

//   try {
//     // First, fetch all regions and create a map of name to ID
//     const allRegiones = await sdb.select({
//       id: regiones.id,
//       nombre: regiones.nombre
//     }).from(regiones);

//     // Create a Map for efficient lookup
//     const regionMap = new Map(
//       allRegiones.map(region => [region.nombre, region.id])
//     );

//     console.log(`Loaded ${regionMap.size} regions`);

//     // Read the CSV file
//     const csvPath = path.join(__dirname, "municipios.csv");
//     const fileContent = fs.readFileSync(csvPath, { encoding: "utf-8" });

//     // Parse the CSV file synchronously
//     const municipiosData = parse(fileContent, {
//       columns: true,
//       skip_empty_lines: true,
//       cast: (value, context) => {
//         // Trim whitespace from all values
//         return typeof value === 'string' ? value.trim() : value;
//       }
//     })
//     // Filter out header rows
//     .filter((record: any) => record.cve_mun && record.cve_mun !== "cve_mun");

//     // Prepare to store municipios with region IDs
//     const municipiosToInsert = [];

//     // Process each municipio
//     for (const record of municipiosData) {
//       // Look up region ID from the map
//       const regionId = regionMap.get(record.Region);

//       if (!regionId) {
//         console.error(`Region not found: ${record.Region}`);
//         continue;
//       }

//       // Add municipio with its region ID
//       municipiosToInsert.push({
//         cve_mun: record.cve_mun.toString(),
//         nombre: record.nom_mun,
//         region_id: regionId,
//         distrito: record.Distrito
//       });
//     }

//     // Insert municipios
//     if (municipiosToInsert.length > 0) {
//       await sdb.insert(municipios).values(municipiosToInsert);
//       console.log(`Inserted ${municipiosToInsert.length} municipios into the database`);
//     } else {
//       console.log("No municipios to insert");
//     }

//   } catch (error) {
//     console.error("Error inserting municipios:", error);
//   } finally {
//     await closeConnection();
//   }
// }

// main().catch(console.error);
