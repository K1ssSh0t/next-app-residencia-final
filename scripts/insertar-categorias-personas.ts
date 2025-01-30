import { categoriaPersonas } from "@/schema/categoria-personas";
import { openConnection } from "./sdb";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  try {
    // 1. Leer y parsear CSV
    const csvPath = path.join(__dirname, "categorias-personas.csv");
    const fileContent = fs.readFileSync(csvPath, { encoding: "utf-8" });

    const rawData = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value: string) => value.trim(),
    });

    // 2. Validar estructura y contenido
    const categoriasValidas = [];
    const valoresPermitidos = new Set(["ambos", "superior", "medioSuperior"]);

    for (const record of rawData) {
      // Normalizar nombres de columnas
      const descripcion = record.descripcion || record.Descripcion;
      const nivel = record.nivelAplicado || record["nivel aplicado"];

      if (!descripcion || !nivel) {
        console.error("Registro incompleto:", record);
        continue;
      }

      if (!valoresPermitidos.has(nivel)) {
        console.error(`Nivel inválido '${nivel}' en: ${descripcion}`);
        continue;
      }

      categoriasValidas.push({
        descripcion,
        nivelAplicado: nivel,
      });
    }

    // 3. Prevenir duplicados
    const existentes = await sdb
      .select({
        descripcion: categoriaPersonas.descripcion,
        nivelAplicado: categoriaPersonas.nivelAplicado,
      })
      .from(categoriaPersonas);

    const clavesExistentes = new Set(
      existentes.map((e) => `${e.descripcion}|${e.nivelAplicado}`)
    );

    const nuevasCategorias = categoriasValidas.filter(
      (c) => !clavesExistentes.has(`${c.descripcion}|${c.nivelAplicado}`)
    );

    // 4. Insertar registros
    if (nuevasCategorias.length > 0) {
      await sdb.insert(categoriaPersonas).values(nuevasCategorias);
      console.log(`Insertadas ${nuevasCategorias.length} categorías:`);
      nuevasCategorias.forEach((c) =>
        console.log(`- ${c.descripcion} (${c.nivelAplicado})`)
      );
    } else {
      console.log("No hay nuevas categorías para insertar");
    }
  } catch (error) {
    console.error("Error en el proceso:", error);
  } finally {
    await closeConnection();
  }
}

main().catch(console.error);
