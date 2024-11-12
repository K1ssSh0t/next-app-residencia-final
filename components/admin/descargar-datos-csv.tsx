"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { stringify } from "csv-stringify/sync";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

async function fetchData() {
    const response = await fetch("/api/export-data");
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
    }
    return response.json();
}

export function DownloadCSVButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownload = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchData();
            console.log("Fetched data:", JSON.stringify(data, null, 2)); // Log para depuración

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("No se encontraron datos para exportar");
            }

            const consolidatedData = data.reduce((acc, item) => {
                const key = `${item.usuario}-${item.carrera}`;

                if (!acc[key]) {
                    acc[key] = {
                        usuario: item.usuario,
                        institucion: item.institucion,
                        region: item.region,
                        municipio: item.municipio,
                        tipoInstitucion: item.tipoInstitucion,
                        tipoBachiller: item.tipoBachiller,
                        nivelEducativo: item.nivelEducativo ? "Superior" : "Media Superior",
                        añoCuestionario: item.añoCuestionario,
                        carrera: item.carrera,
                        categorias: {}
                    };
                }

                item.preguntasData.forEach((pregunta: any) => {
                    if (pregunta.categoriaPersona) {
                        const { categoriaPersona, cantidadMujeres, cantidadHombres } = pregunta;
                        acc[key].categorias[categoriaPersona] = {
                            cantidadMujeres: (acc[key].categorias[categoriaPersona]?.cantidadMujeres || 0) + (cantidadMujeres || 0),
                            cantidadHombres: (acc[key].categorias[categoriaPersona]?.cantidadHombres || 0) + (cantidadHombres || 0)
                        };
                    }
                });

                return acc;
            }, {});

            const flattenedData = Object.values(consolidatedData).map((item: any) => {
                const baseData = {
                    usuario: item.usuario,
                    institucion: item.institucion,
                    region: item.region,
                    municipio: item.municipio,
                    tipoInstitucion: item.tipoInstitucion,
                    tipoBachiller: item.tipoBachiller,
                    nivelEducativo: item.nivelEducativo,
                    añoCuestionario: item.añoCuestionario,
                    carrera: item.carrera
                };

                Object.entries(item.categorias).forEach(([categoriaPersona, counts]) => {
                    //@ts-ignore
                    baseData[`cantidadMujeres_${categoriaPersona}`] = counts.cantidadMujeres;
                    //@ts-ignore
                    baseData[`cantidadHombres_${categoriaPersona}`] = counts.cantidadHombres;
                });

                return baseData;
            });

            const csv = stringify(flattenedData, {
                header: true,
                columns: [
                    "usuario",
                    "institucion",
                    "region",
                    "municipio",
                    "tipoInstitucion",
                    "tipoBachiller",
                    "nivelEducativo",
                    "añoCuestionario",
                    "carrera",
                    ...new Set(flattenedData.flatMap(item =>
                        Object.keys(item).filter(key => key.startsWith("cantidad"))
                    ))
                ]
            });

            const blob = new Blob([csv], { type: "text/csv;charset=utf-32;" });
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "datos_cuestionarios.csv");
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            toast({
                title: "Éxito",
                description: "Los datos se han descargado correctamente.",
            });
        } catch (error) {
            console.error("Error downloading CSV:", error);
            setError(error instanceof Error ? error.message : String(error));
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Hubo un problema al descargar los datos.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button onClick={handleDownload} disabled={isLoading}>
                {isLoading ? "Descargando..." : "Descargar CSV"}
                <Download className="ml-2 h-4 w-4" />
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
