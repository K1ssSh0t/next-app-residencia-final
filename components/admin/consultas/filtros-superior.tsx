"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TotalsCardProps {
  totals: {
    [key: string]: { hombres: number; mujeres: number; total: number };
  };
  title: string;
  showChart: boolean;
}

import { Check, ChevronsUpDown, Search, Loader2, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InstitucionesBusqueda,
  buscarSuperior,
} from "@/actions/admin/consultas/buscar-instituciones-superior";
import { Institucion } from "@/schema/instituciones";
import { Card, CardContent } from "@/components/ui/card";
import { InstitucionesWithRelations } from "@/repositories/institucione-repository";

interface Option {
  regionId?: string | null;
  value: string;
  label: string | null;
}

interface FilterOptions {
  regions: Option[];
  municipalities: Option[];
  institutionTypes: Option[];
  modalities?: Option[];
  institutions?: Option[];
}

interface TotalViewProps {
  totals: {
    [key: string]: { hombres: number; mujeres: number; total: number };
  };
  title: string;
  showChart: boolean;
}

function TotalsCard({ totals, title, showChart }: TotalsCardProps) {
  const [displayChart, setDisplayChart] = React.useState(showChart);

  const data = Object.entries(totals).map(([category, data]) => ({
    name: category,
    Hombres: data.hombres,
    Mujeres: data.mujeres,
    Total: data.total,
  }));

  const modifiedData = React.useMemo(() => {
    /*return data.map((item) => {
      if (item.name === "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL") {
        return {
          name: item.name,
          Total: item.Total,
          Hombres: 0, // Set to 0 to hide the bar
          Mujeres: 0, // Set to 0 to hide the bar
        };
      } else {
        return { ...item }; // Return the original data
      }
    });*/
    return data.filter((item) => {
      return item.name !== "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL";
    });
  }, [data]);

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisplayChart(!displayChart)}
          >
            {displayChart ? "Mostrar Tabla" : "Mostrar Gráfico"}
          </Button>
        </div>
        {displayChart ? (
          <div className="w-full h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={700} height={500} data={modifiedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-40}
                  textAnchor="end"
                  height={200}
                  tickMargin={1}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Hombres" fill="#8884d8" />
                <Bar dataKey="Mujeres" fill="#f15bb5" />
                <Bar dataKey="Total" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(totals).map(([category, data]) => (
              <div key={category} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{category}</h4>
                <div className="space-y-1 text-sm">
                  {category === "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL" ? (
                    <p className="font-semibold">
                      Total: <span className="font-bold text-lg">{data.total}</span>
                    </p>
                  ) : (
                    <>
                      <p>
                        Hombres: <span className="font-bold text-lg">{data.hombres}</span>
                      </p>
                      <p>
                        Mujeres: <span className="font-bold text-lg">{data.mujeres}</span>
                      </p>
                      <p className="font-semibold">
                        Total: <span className="font-bold text-lg">{data.total}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const convertToCSV = (
  data: InstitucionesBusqueda,
  categoriasCuestionario: string[],
  categoriasGenerales: string[],
) => {
  const headers = [
    "Año",
    "Clave Carrera",
    "Nombre Carrera",
    //REVOE
    "Número REVOE",
    "Institución",
    "Tipo de Institución",
    "Modalidad",
    "Región",
    "Municipio",
    ...categoriasCuestionario.map(
      (c) => `${c}_Hombres,${c}_Mujeres,${c}_Total`,
    ),
    ...categoriasGenerales.map((c) =>
      c === "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL"
        ? `${c}_Total`
        : `${c}_Hombres,${c}_Mujeres,${c}_Total`,
    ),
  ].join(",");

  const rows = data
    .filter(
      (institution) =>
        (institution.datosInstitucionales &&
          institution.datosInstitucionales.length > 0) ||
        (institution.cuestionario && institution.cuestionario.length > 0),
    )
    .flatMap((institution) => {
      if (institution.cuestionario && institution.cuestionario.length > 0) {
        return institution.cuestionario.map((cuestionario) => {
          const basicInfo = [
            cuestionario.año,
            cuestionario.carrera?.carrera?.clave || "",
            cuestionario.carrera?.carrera?.descripcion || "",
            //cuestionario.carrera?.nombreRevoe || "",
            cuestionario.carrera?.numeroRevoe || "",
            institution.nombre || "",
            institution.tipoInstituciones?.descripcion || "",
            cuestionario.carrera?.modalidad?.descripcion || "",
            institution.region?.nombre || "",
            institution.municipio?.nombre || "",
          ];

          const cuestionarioData = categoriasCuestionario.map((category) => {
            const pregunta = cuestionario.preguntas.find(
              (p) => p.categoriaPersona?.descripcion === category,
            );
            const h = Number(pregunta?.cantidadHombres || 0);
            const m = Number(pregunta?.cantidadMujeres || 0);
            const total = Number(h) + Number(m);
            return `${h},${m},${total}`;
          });

          const datosInstitucionales = categoriasGenerales.map((category) => {
            const dato = institution.datosInstitucionales?.find(
              (d) => d.categoriasGenerales?.descripcion === category,
            );
            const h = Number(dato?.cantidadHombres || 0);
            const m = Number(dato?.cantidadMujeres || 0);
            return category === "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL"
              ? `${Number(h) + Number(m)}`
              : `${h},${m},${h + m}`;
          });

          return [
            ...basicInfo,
            ...cuestionarioData,
            ...datosInstitucionales,
          ].join(",");
        });
      } else {
        const año = institution.datosInstitucionales?.[0]?.anio || "-";
        const basicInfo = [
          año, // Usar el año de datos institucionales
          "-", // carrera
          //"-", // REVOE
          "-", // número REVOE
          institution.nombre || "",
          institution.tipoInstituciones?.descripcion || "",
          "-", // modalidad
          institution.region?.nombre || "",
          institution.municipio?.nombre || "",
        ];

        const cuestionarioData = categoriasCuestionario.map(() => "0,0,0");

        const datosInstitucionales = categoriasGenerales.map((category) => {
          const dato = institution.datosInstitucionales?.find(
            (d) => d.categoriasGenerales?.descripcion === category,
          );
          const h = dato?.cantidadHombres || 0;
          const m = dato?.cantidadMujeres || 0;
          return category === "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL"
            ? `${Number(h) + Number(m)}`
            : `${h},${m},${Number(h) + Number(m)}`;
        });

        return [
          [...basicInfo, ...cuestionarioData, ...datosInstitucionales].join(
            ",",
          ),
        ];
      }
    });

  return `${headers}\n${rows.join("\n")}`;
};

export function ComboboxFilter({
  options,
  placeholder = "Seleccionar",
  value,
  onChange,
}: {
  options: Option[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between hover:bg-[#631233] hover:text-white"
        >
          <span className="block truncate">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Buscar ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          {/* <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup> */}
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label ?? ''} // se filtra por label
                onSelect={() => {
                  onChange(option.value === value ? "" : option.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function FiltrosSuperior({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [selectedMunicipality, setSelectedMunicipality] = React.useState("");
  const [selectedInstitutionType, setSelectedInstitutionType] =
    React.useState("");
  const [nombreInstitucion, setNombreInstitucion] = React.useState("");
  const [isInstitucionSelect, setIsInstitucionSelect] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [selectedCareer, setSelectedCareer] = React.useState("");
  const [selectedModality, setSelectedModality] = React.useState("");
  const [results, setResults] = React.useState<InstitucionesBusqueda>();
  const [categoriasCuestionario, setCategoriasCuestionario] = React.useState<
    string[]
  >([]);
  const [categoriasGenerales, setCategoriasGenerales] = React.useState<
    string[]
  >([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const [filteredMunicipalities, setFilteredMunicipalities] = React.useState(
    filterOptions.municipalities,
  );

  const careers = [
    { value: "carrera", label: "Carrera (Clave 4-5)" },
    { value: "especialidad", label: "Especialidad (Clave 6)" },
    { value: "maestria", label: "Maestría (Clave 7)" },
    { value: "doctorado", label: "Doctorado (Clave 8)" },
  ];

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Modificar la estructura de paginación para manejar instituciones directamente
  const paginatedResults = results?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const [showDetailedView, setShowDetailedView] = React.useState(false);

  React.useEffect(() => {
    if (selectedRegion) {
      const municipiosFiltrados = filterOptions.municipalities.filter(
        (municipio) => municipio.regionId === selectedRegion,
      );
      setFilteredMunicipalities(municipiosFiltrados);
    } else {
      setFilteredMunicipalities([]);
    }
  }, [selectedRegion, filterOptions.municipalities]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  const handleSearch = () => {
    setError(null);

    // if (!selectedRegion || !selectedInstitutionType) {
    //     setError("Por favor seleccione región y tipo de institución")
    //     return
    // }

    startTransition(async () => {
      try {
        const institutions = await buscarSuperior({
          region: selectedRegion || undefined,
          institutionType: selectedInstitutionType || undefined,
          municipalityType: selectedMunicipality || undefined,
          institutionName: nombreInstitucion || undefined,
          year: selectedYear || undefined,
          careerType: selectedCareer || undefined,
        });
        setResults(institutions);

        // Extract unique categories
        const uniqueCategories = new Set<string>();
        const uniqueCategoriesPreguntas = new Set<string>();
        institutions.forEach((institution) => {
          institution.datosInstitucionales?.forEach((dato) => {
            if (dato.categoriasGenerales?.descripcion) {
              uniqueCategories.add(dato.categoriasGenerales.descripcion);
            }
          });
          institution.cuestionario?.forEach((cuestionario: any) => {
            cuestionario.preguntas.forEach((pregunta: any) => {
              if (pregunta.categoriaPersona?.descripcion) {
                uniqueCategoriesPreguntas.add(
                  pregunta.categoriaPersona.descripcion,
                );
              }
            });
          });
        });
        setCategoriasCuestionario(Array.from(uniqueCategoriesPreguntas));
        setCategoriasGenerales(Array.from(uniqueCategories));
      } catch (err) {
        setError("Error al buscar instituciones");
      }
    });
  };

  const handleExportFiltered = () => {
    if (!results) return;
    const csv = convertToCSV(
      results,
      categoriasCuestionario,
      categoriasGenerales,
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "instituciones_superior_filtradas.csv";
    link.click();
  };

  const handleExportAll = async () => {
    try {
      const allInstitutions = await buscarSuperior({});
      const csv = convertToCSV(
        allInstitutions,
        categoriasCuestionario,
        categoriasGenerales,
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "todas_instituciones_superior.csv";
      link.click();
    } catch (error) {
      setError("Error al exportar todas las instituciones");
    }
  };

  const calculateTotals = (institution: InstitucionesBusqueda[0]) => {
    const totals: {
      [key: string]: { hombres: number; mujeres: number; total: number };
    } = {};

    institution.datosInstitucionales?.forEach((dato) => {
      const categoria =
        dato.categoriasGenerales?.descripcion || "Sin categoría";
      if (!totals[categoria]) {
        totals[categoria] = { hombres: 0, mujeres: 0, total: 0 };
      }
      totals[categoria].hombres += Number(dato.cantidadHombres || 0);
      totals[categoria].mujeres += dato.cantidadMujeres || 0;
      totals[categoria].total +=
        Number(dato.cantidadHombres || 0) + Number(dato.cantidadMujeres || 0);
    });

    return totals;
  };

  const calculateOverallTotals = (institutions: InstitucionesBusqueda) => {
    const overallTotals: {
      [key: string]: { hombres: number; mujeres: number; total: number };
    } = {};

    institutions.forEach((institution) => {
      institution.datosInstitucionales?.forEach((dato) => {
        const categoria =
          dato.categoriasGenerales?.descripcion || "Sin categoría";
        if (!overallTotals[categoria]) {
          overallTotals[categoria] = { hombres: 0, mujeres: 0, total: 0 };
        }
        overallTotals[categoria].hombres += Number(dato.cantidadHombres || 0);
        overallTotals[categoria].mujeres += Number(dato.cantidadMujeres || 0);
        overallTotals[categoria].total +=
          Number(dato.cantidadHombres || 0) + Number(dato.cantidadMujeres || 0);
      });
      institution.cuestionario?.forEach((cuestionario) => {
        cuestionario?.preguntas.forEach((pregunta) => {
          const categoria =
            pregunta.categoriaPersona?.descripcion || "Sin categoría";
          if (!overallTotals[categoria]) {
            overallTotals[categoria] = { hombres: 0, mujeres: 0, total: 0 };
          }
          // Assuming each question has a count of responses or similar metric
          overallTotals[categoria].hombres += pregunta.cantidadHombres || 0;
          overallTotals[categoria].mujeres += pregunta.cantidadMujeres || 0;
          overallTotals[categoria].total +=
            pregunta.cantidadHombres! + pregunta.cantidadMujeres!;
        });
      });
    });

    return overallTotals;
  };

  const renderResults = () => {
    if (!results || results.length === 0) return null;

    // Filtrar solo las instituciones que tienen datos para mostrar
    const institucionesConDatos = results.filter(
      (institution) =>
        (institution.datosInstitucionales &&
          institution.datosInstitucionales.length > 0) ||
        (institution.cuestionario && institution.cuestionario.length > 0),
    );

    // Usar las instituciones filtradas para la paginación
    const paginatedInstitutions = institucionesConDatos.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );

    const overallTotals = calculateOverallTotals(institucionesConDatos);
    const cuestionarioTotals = Object.fromEntries(
      categoriasCuestionario.map((category) => [
        category,
        overallTotals[category] || { hombres: 0, mujeres: 0, total: 0 },
      ]),
    );

    const institucionTotals = Object.fromEntries(
      categoriasGenerales.map((category) => [
        category,
        overallTotals[category] || { hombres: 0, mujeres: 0, total: 0 },
      ]),
    );

    return (
      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-lg font-medium mb-2 sm:mb-0">Resultados</h3>
          <div className="space-x-2 flex flex-wrap gap-2 justify-end w-full sm:w-auto">
            <Button
              onClick={() => setShowDetailedView(!showDetailedView)}
              variant="outline"
              className="w-full sm:w-auto ml-2 hidden sm:block"

            >
              {showDetailedView ? "Ver Solo Totales" : "Ver Tabla Detallada"}
            </Button>
            <Button
              onClick={handleExportFiltered}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Filtrados
            </Button>
            <Button
              onClick={handleExportAll}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Todos
            </Button>
          </div>
        </div>

        <div><p className="italic">{"Nota: Los datos generales se toman en cuenta una vez por institución(Todos Los indicadores que tengan 'General')"}</p></div>

        {showDetailedView ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Año</TableHead>
                  <TableHead>Clave de Carrera</TableHead>
                  <TableHead className="w-[200px]">Nombre Carrera</TableHead>
                  {/*<TableHead>REVOE</TableHead>*/}
                  <TableHead>Número REVOE</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Clave Centro de Trabajo</TableHead>
                  <TableHead>Clave Institución</TableHead>
                  <TableHead>Institución</TableHead>
                  <TableHead>Tipo de Institución</TableHead>

                  <TableHead>Región</TableHead>
                  <TableHead>Municipio</TableHead>
                  {categoriasGenerales.map((category) => (
                    <TableHead key={category}>{category}</TableHead>
                  ))}
                  {categoriasCuestionario.map((category) => (
                    <TableHead key={category}>{category}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInstitutions?.map((institution) =>
                  // Si tiene cuestionarios, mostrar una fila por cada uno
                  institution.cuestionario &&
                    institution.cuestionario.length > 0
                    ? institution.cuestionario.map((cuestionario) => (
                      <TableRow key={`${institution.id}-${cuestionario.id}`}>
                        <TableCell>{cuestionario.año}</TableCell>
                        <TableCell>
                          {cuestionario.carrera?.carrera?.clave}
                        </TableCell>
                        <TableCell className="font-medium">
                          {cuestionario.carrera?.carrera?.descripcion}
                        </TableCell>
                        {/*<TableCell>
                            {cuestionario.carrera?.nombreRevoe}
                          </TableCell>*/}
                        <TableCell>
                          {cuestionario.carrera?.numeroRevoe}
                        </TableCell>
                        <TableCell>
                          {cuestionario.carrera?.modalidad?.descripcion}
                        </TableCell>
                        <TableCell>{institution.claveCentroTrabajo}</TableCell>
                        <TableCell>
                          {institution.claveInstitucion}
                        </TableCell>
                        <TableCell>{institution.nombre}</TableCell>
                        <TableCell>
                          {institution.tipoInstituciones?.descripcion}
                        </TableCell>

                        <TableCell>{institution.region?.nombre}</TableCell>
                        <TableCell>{institution.municipio?.nombre}</TableCell>
                        {categoriasGenerales.map((category) => (
                          <TableCell key={`${institution.id}-${category}`}>
                            {institution.datosInstitucionales
                              ?.filter(
                                (dato) =>
                                  dato.categoriasGenerales?.descripcion ===
                                  category,
                              )
                              .map((dato) =>
                                category ===
                                  "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL" ? (
                                  <div key={dato.id} className="text-sm">
                                    Total:{" "}
                                    {Number(dato.cantidadHombres!) +
                                      Number(dato.cantidadMujeres!)}
                                  </div>
                                ) : (
                                  <div key={dato.id} className="text-sm">
                                    H: {Number(dato.cantidadHombres!)}
                                    <br />
                                    M: {dato.cantidadMujeres!}
                                    <br />
                                    T:{" "}
                                    {Number(dato.cantidadHombres!) +
                                      Number(dato.cantidadMujeres!)}
                                  </div>
                                ),
                              )}
                          </TableCell>
                        ))}
                        {categoriasCuestionario.map((category) => (
                          <TableCell key={`${cuestionario.id}-${category}`}>
                            {cuestionario.preguntas
                              .filter(
                                (pregunta) =>
                                  pregunta.categoriaPersona?.descripcion ===
                                  category,
                              )
                              .map((pregunta) => (
                                <div key={pregunta.id} className="text-sm">
                                  H: {pregunta.cantidadHombres!} <br />
                                  M: {pregunta.cantidadMujeres!} <br />
                                  T:{" "}
                                  {pregunta.cantidadHombres! +
                                    pregunta.cantidadMujeres!}
                                </div>
                              ))}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                    : // Si no tiene cuestionarios pero sí datos institucionales, mostrar una fila con el año
                    institution.datosInstitucionales &&
                    institution.datosInstitucionales.length > 0 && (
                      <TableRow key={institution.id}>
                        <TableCell>
                          {institution.datosInstitucionales[0]?.anio || "-"}
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{institution.claveInstitucion}</TableCell>
                        <TableCell>{institution.nombre}</TableCell>
                        <TableCell>
                          {institution.tipoInstituciones?.descripcion}
                        </TableCell>

                        <TableCell>{institution.region?.nombre}</TableCell>
                        <TableCell>{institution.municipio?.nombre}</TableCell>
                        {categoriasGenerales.map((category) => (
                          <TableCell key={`${institution.id}-${category}`}>
                            {institution.datosInstitucionales
                              ?.filter(
                                (dato) =>
                                  dato.categoriasGenerales?.descripcion ===
                                  category,
                              )
                              .map((dato) =>
                                category ===
                                  "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL" ? (
                                  <div key={dato.id} className="text-sm">
                                    Total:{" "}
                                    {Number(dato.cantidadHombres!) +
                                      Number(dato.cantidadMujeres!)}
                                  </div>
                                ) : (
                                  <div key={dato.id} className="text-sm">
                                    H: {Number(dato.cantidadHombres!)}
                                    <br />
                                    M: {dato.cantidadMujeres!}
                                    <br />
                                    T:{" "}
                                    {Number(dato.cantidadHombres!) +
                                      Number(dato.cantidadMujeres!)}
                                  </div>
                                ),
                              )}
                          </TableCell>
                        ))}
                        {categoriasCuestionario.map((category) => (
                          <TableCell key={`${institution.id}-${category}`}>
                            -
                          </TableCell>
                        ))}
                      </TableRow>
                    ),
                )}
                <TableRow>
                  <TableCell className="font-medium">Totales</TableCell>
                  <TableCell colSpan={10}></TableCell>
                  {categoriasGenerales.map((category) => {
                    const overallTotals = calculateOverallTotals(results);
                    return (
                      <TableCell key={`total-${category}`}>
                        {overallTotals[category] ? (
                          category ===
                            "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL" ? (
                            <div className="text-sm">
                              Total: {overallTotals[category].total}
                            </div>
                          ) : (
                            <div className="text-sm">
                              H: {overallTotals[category].hombres}
                              <br />
                              M: {overallTotals[category].mujeres}
                              <br />
                              T: {overallTotals[category].total}
                            </div>
                          )
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    );
                  })}
                  {categoriasCuestionario.map((category) => {
                    const overallTotals = calculateOverallTotals(results);
                    return (
                      <TableCell key={`total-${category}`}>
                        {overallTotals[category] ? (
                          <div className="text-sm">
                            H: {overallTotals[category].hombres}
                            <br />
                            M: {overallTotals[category].mujeres}
                            <br />
                            T: {overallTotals[category].total}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="space-y-4">
            <TotalsCard
              totals={cuestionarioTotals}
              title="Totales por Categoría de Cuestionario"
              showChart={false}
            />
            <TotalsCard
              totals={institucionTotals}
              title="Totales por Categoría Institucional"
              showChart={false}
            />
          </div>
        )}

        {showDetailedView && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="mx-2">
              Página {currentPage} de{" "}
              {Math.ceil(institucionesConDatos.length / itemsPerPage)}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(institucionesConDatos.length / itemsPerPage)
              }
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[95vw] mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Instituciones Nivel Superior
      </h1>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Seleccionar Filtros (Opcional)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Región</label>
            <ComboboxFilter
              options={filterOptions.regions}
              placeholder="Todas las regiones"
              value={selectedRegion}
              onChange={setSelectedRegion}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Municipio</label>
            <ComboboxFilter
              options={filteredMunicipalities}
              placeholder="Seleccionar municipio"
              value={selectedMunicipality}
              onChange={setSelectedMunicipality}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo Institución</label>
            <ComboboxFilter
              options={filterOptions.institutionTypes}
              placeholder="Todos los tipos"
              value={selectedInstitutionType}
              onChange={setSelectedInstitutionType}
            />
          </div>

          <div className="">
            <label htmlFor="" className="text-sm font-medium">
              Nombre de Institución
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInstitucionSelect(!isInstitucionSelect)}
                className="ml-2 mb-1"
              >
                {isInstitucionSelect ? "Campo de Texto" : "Selector"}
              </Button>
            </label>
            {isInstitucionSelect ? (
              <ComboboxFilter
                options={filterOptions.institutions || []}
                placeholder="Seleccionar institución"
                value={nombreInstitucion}
                onChange={setNombreInstitucion}
              />
            ) : (
              <input
                type="text"
                value={nombreInstitucion}
                onChange={(e) => setNombreInstitucion(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Año</label>
            <ComboboxFilter
              options={years}
              placeholder="Seleccionar año"
              value={selectedYear}
              onChange={setSelectedYear}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Carrera</label>
            <ComboboxFilter
              options={careers}
              placeholder="Seleccionar tipo"
              value={selectedCareer}
              onChange={setSelectedCareer}
            />
          </div>
          {/*
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Modalidad Carrera</label>
                        <ComboboxFilter
                            options={filterOptions.modalities}
                            placeholder="Seleccionar modalidad"
                            value={selectedModality}
                            onChange={setSelectedModality}
                        />
                    </div> */}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSearch}
          disabled={isPending}
          className="w-full md:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Buscar Instituciones
            </>
          )}
        </Button>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {!error && !isPending && results && results.length === 0 && (
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-sm text-muted-foreground">
              No hay instituciones que coincidan con los criterios de búsqueda
              seleccionados. Por favor, intente con diferentes filtros.
            </p>
          </CardContent>
        </Card>
      )}

      {renderResults()}
    </div>
  );
}
