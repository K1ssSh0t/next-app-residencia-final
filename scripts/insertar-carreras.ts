import { carreras } from "@/schema/carreras";
import { openConnection } from "./sdb";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // Read the CSV file
    const csvPath = path.join(__dirname, "datos carreras test.csv");
    const fileContent = fs.readFileSync(csvPath, { encoding: "utf-8" });

    // Parse the CSV file synchronously
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ",",
      cast: (value, context) => {
        // Trim whitespace from all values
        return typeof value === "string" ? value.trim() : value;
      },
    })
      // Filter out header rows and map to desired format
      .filter((record: any) => record.CLAVE && record.CLAVE !== "CLAVE")
      .map((record: any) => ({
        descripcion: record.NOMBRE,
        clave: record.CLAVE,
      }));

    // Insert records into the database
    console.log("records", records);
    if (records.length > 0) {
      await sdb.insert(carreras).values(records);
      console.log(`Inserted ${records.length} carreras into the database`);
    } else {
      console.log("No records to insert");
    }
  } catch (error) {
    console.error("Error inserting carreras:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);
