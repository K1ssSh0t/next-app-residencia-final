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
  buscarMedioSuperior,
} from "@/actions/admin/consultas/buscar-instituciones-medio-superior";
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
  tiposBachillerato: Option[];
  careers?: Option[];
  modalities?: Option[];
  institutions?: Option[];
}

const convertToCSV = (
  data: InstitucionesBusqueda,
  categories: string[],
  preguntaCategories: string[],
  especialidadesList: string[],
) => {
  const headers = [
    "Año",
    "Nombre",
    "Clave de la Institución",
    "Clave de Centro de Trabajo",
    "Tipo de Institución",
    "Tipo de Bachiller",
    "Modalidad",
    "Región",
    "Municipio",
    ...categories.map((c) =>
      c === "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL"
        ? `${c}_Total`
        : `${c}_Hombres,${c}_Mujeres,${c}_Total`,
    ),
    ...preguntaCategories.map((c) => `${c}_Hombres,${c}_Mujeres,${c}_Total`),
    ...especialidadesList.map((e) => `${e}_Hombres,${e}_Mujeres,${e}_Total`),
  ].join(",");

  const rows = data.map((institution) => {
    const totals = calculateTotals(institution);

    const basicInfo = [
      institution.cuestionariosData?.año || "",
      institution.nombre,
      institution.claveInstitucion || "",
      institution.claveCentroTrabajo || "",
      institution.tipoInstituciones?.descripcion || "",
      institution.tipoBachilleres?.descripcion || "",
      institution.modalidad?.descripcion || "",
      institution.region?.nombre || "",
      institution.municipio?.nombre || "",
    ];

    const categoryData = categories.map((category) => {
      const total = totals[category] || { hombres: 0, mujeres: 0, total: 0 };
      return category === "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL"
        ? `${total.total}`
        : `${total.hombres},${total.mujeres},${total.total}`;
    });

    const preguntasData = preguntaCategories.map((category) => {
      const pregunta = institution.cuestionariosData?.preguntas.find(
        (p: any) => p.categoriaPersona?.descripcion === category,
      );
      const h = pregunta?.cantidadHombres || 0;
      const m = pregunta?.cantidadMujeres || 0;
      return `${h},${m},${h + m}`;
    });

    const especialidadesData = especialidadesList.map((especialidad) => {
      const esp = institution.cuestionariosData?.especialidades.find(
        (e: any) => e.especialidadLista.descripcion === especialidad,
      );
      const h = esp?.hombres || 0;
      const m = esp?.mujeres || 0;
      return `${h},${m},${h + m}`;
    });

    return [
      ...basicInfo,
      ...categoryData,
      ...preguntasData,
      ...especialidadesData,
    ].join(",");
  });

  return `${headers}\n${rows.join("\n")}`;
};

const calculateTotals = (institution: InstitucionesBusqueda[0]) => {
  const totals: {
    [key: string]: { hombres: number; mujeres: number; total: number };
  } = {};

  institution.datosInstitucionales?.forEach((dato) => {
    const categoria = dato.categoriasGenerales?.descripcion || "Sin categoría";
    if (!totals[categoria]) {
      totals[categoria] = { hombres: 0, mujeres: 0, total: 0 };
    }
    totals[categoria].hombres += Number(dato.cantidadHombres) || 0;
    totals[categoria].mujeres += dato.cantidadMujeres || 0;
    totals[categoria].total +=
      (Number(dato.cantidadHombres) || 0) + (Number(dato.cantidadMujeres) || 0);
  });

  return totals;
};

interface TotalViewProps {
  totals: {
    [key: string]: { hombres: number; mujeres: number; total: number };
  };
  title: string;
  showChart: boolean;
}

function TotalsCard({ totals, title, showChart }: TotalViewProps) {
  const [displayChart, setDisplayChart] = React.useState(showChart);

  const data = Object.entries(totals).map(([category, data]) => ({
    name: category,
    Hombres: data.hombres,
    Mujeres: data.mujeres,
    Total: data.total,
  }));

  const modifiedData = React.useMemo(() => {
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
                <Bar dataKey="Mujeres" fill="#82ca9d" />
                <Bar dataKey="Total" fill="#ffc658" />
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
                    <p className="font-semibold">Total: {data.total}</p>
                  ) : (
                    <>
                      <p>Hombres: {data.hombres}</p>
                      <p>Mujeres: {data.mujeres}</p>
                      <p className="font-semibold">Total: {data.total}</p>
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
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Buscar ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup>
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
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function FiltrosMedioSuperior({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [selectedMunicipality, setSelectedMunicipality] = React.useState("");
  const [selectedInstitutionType, setSelectedInstitutionType] =
    React.useState("");
  const [selectedBachilleratoType, setSelectedBachilleratoType] =
    React.useState("");
  const [nombreInstitucion, setNombreInstitucion] = React.useState("");
  const [selectedCareer, setSelectedCareer] = React.useState("");
  const [selectedModality, setSelectedModality] = React.useState("");
  const [results, setResults] = React.useState<InstitucionesBusqueda>();
  const [categoriasGenerales, setCategoriasGenerales] = React.useState<
    string[]
  >([]);
  const [categoriasPreguntas, setCategoriasPreguntas] = React.useState<
    string[]
  >([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const [filteredMunicipalities, setFilteredMunicipalities] = React.useState(
    filterOptions.municipalities,
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedResults = results?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

  const [especialidades, setEspecialidades] = React.useState<string[]>([]);
  const [selectedYear, setSelectedYear] = React.useState("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  const handleSearch = () => {
    setError(null);
    startTransition(async () => {
      try {
        const institutions = await buscarMedioSuperior({
          region: selectedRegion || undefined,
          institutionType: selectedInstitutionType || undefined,
          municipalityType: selectedMunicipality || undefined,
          institutionName: nombreInstitucion || undefined,
          tipoBachillerato: selectedBachilleratoType || undefined,
          year: selectedYear || undefined, // Agregar el año
        });
        setResults(institutions);

        // Extract unique categories and specialties
        const uniqueCategories = new Set<string>();
        const uniqueCategoriesPreguntas = new Set<string>();
        const uniqueEspecialidades = new Set<string>();

        institutions.forEach((institution) => {
          institution.datosInstitucionales?.forEach((dato) => {
            if (dato.categoriasGenerales?.descripcion) {
              uniqueCategories.add(dato.categoriasGenerales.descripcion);
            }
          });
          institution.cuestionariosData?.preguntas.forEach((pregunta: any) => {
            if (pregunta.categoriaPersona?.descripcion) {
              uniqueCategoriesPreguntas.add(
                pregunta.categoriaPersona.descripcion,
              );
            }
          });
          institution.cuestionariosData?.especialidades.forEach(
            (especialidad: any) => {
              if (especialidad.especialidadLista?.descripcion) {
                uniqueEspecialidades.add(
                  especialidad.especialidadLista.descripcion,
                );
              }
            },
          );
        });
        setCategoriasGenerales(Array.from(uniqueCategories));
        setCategoriasPreguntas(Array.from(uniqueCategoriesPreguntas));
        setEspecialidades(Array.from(uniqueEspecialidades));
      } catch (err) {
        setError("Error al buscar instituciones");
      }
    });
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
        overallTotals[categoria].hombres += Number(dato.cantidadHombres) || 0;
        overallTotals[categoria].mujeres += dato.cantidadMujeres || 0;
        overallTotals[categoria].total +=
          Number(dato.cantidadHombres || 0) + Number(dato.cantidadMujeres || 0);
      });

      institution.cuestionariosData?.preguntas.forEach((pregunta) => {
        const categoria =
          pregunta.categoriaPersona?.descripcion || "Sin categoría";
        if (!overallTotals[categoria]) {
          overallTotals[categoria] = { hombres: 0, mujeres: 0, total: 0 };
        }
        // Assuming each question has a count of responses or similar metric
        overallTotals[categoria].hombres += pregunta.cantidadHombres ?? 0;
        overallTotals[categoria].mujeres += pregunta.cantidadMujeres ?? 0;
        overallTotals[categoria].total +=
          pregunta.cantidadHombres! + pregunta.cantidadMujeres!; // Adjust this line based on actual data structure
      });
    });

    return overallTotals;
  };

  const handleExportFiltered = () => {
    if (!results) return;
    const csv = convertToCSV(
      results,
      categoriasGenerales,
      categoriasPreguntas,
      especialidades,
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "instituciones_filtradas.csv";
    link.click();
  };

  const handleExportAll = async () => {
    try {
      const allInstitutions = await buscarMedioSuperior({});
      const csv = convertToCSV(
        allInstitutions,
        categoriasGenerales,
        categoriasPreguntas,
        especialidades,
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "todas_instituciones.csv";
      link.click();
    } catch (error) {
      setError("Error al exportar todas las instituciones");
    }
  };

  const [showDetailedView, setShowDetailedView] = React.useState(true);

  return (
    <div className="w-full max-w-[95vw] mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Instituciones Nivel Medio Superior
      </h1>

      <div className="space-y-4 ">
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo Bachiller</label>
            <ComboboxFilter
              options={filterOptions.tiposBachillerato}
              placeholder="Todos los tipos"
              value={selectedBachilleratoType}
              onChange={setSelectedBachilleratoType}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="" className="text-sm font-medium">
              Nombre de Institución
            </label>
            <input
              type="text"
              value={nombreInstitucion}
              onChange={(e) => setNombreInstitucion(e.target.value)}
              className="w-full border  rounded-md p-2"
            />
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

          {/* <div className="space-y-2">
                        <label className="text-sm font-medium">Carrera Específica</label>
                        <ComboboxFilter
                            options={filterOptions.careers}
                            placeholder="Seleccionar carrera"
                            value={selectedCareer}
                            onChange={setSelectedCareer}
                        />
                    </div> */}
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

      {results && results.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h3 className="text-lg font-medium mb-2 sm:mb-0">Resultados</h3>
            <div className="space-x-2 flex flex-wrap gap-2 justify-end w-full sm:w-auto">
              <Button
                onClick={() => setShowDetailedView(!showDetailedView)}
                variant="outline"
                className="w-full sm:w-auto ml-2"
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

          {showDetailedView ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Año</TableHead>
                    <TableHead className="w-[200px]">Nombre</TableHead>
                    <TableHead>Clave de Institución</TableHead>
                    <TableHead>Clave de Centro de Trabajo</TableHead>
                    <TableHead>Tipo de Institución</TableHead>
                    <TableHead>Tipo de Bachiller</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead>Región</TableHead>
                    <TableHead>Municipio</TableHead>

                    {categoriasGenerales.map((category) => (
                      <TableHead key={category}>{category}</TableHead>
                    ))}
                    {categoriasPreguntas.map((category) => (
                      <TableHead key={category}>{category}</TableHead>
                    ))}
                    {especialidades.map((especialidad) => (
                      <TableHead key={especialidad}>{especialidad}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults?.map((institution: any) => {
                    const totals = calculateTotals(institution);
                    return (
                      <TableRow key={institution.id}>
                        <TableCell>
                          {institution.cuestionariosData?.año}
                        </TableCell>
                        <TableCell className="font-medium">
                          {institution.nombre}
                        </TableCell>
                        <TableCell>{institution.claveInstitucion}</TableCell>
                        <TableCell>
                          {institution.claveCentroTrabajo || "No Aplica"}
                        </TableCell>
                        <TableCell>
                          {institution.tipoInstituciones?.descripcion}
                        </TableCell>
                        <TableCell>
                          {institution.tipoBachilleres?.descripcion}
                        </TableCell>
                        <TableCell>{institution.modalidad.descripcion}</TableCell>
                        <TableCell>{institution.region?.nombre}</TableCell>
                        <TableCell>{institution.municipio?.nombre}</TableCell>
                        {categoriasGenerales.map((category) => (
                          <TableCell key={`${institution.id}-${category}`}>
                            {totals[category] ? (
                              category ===
                                "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL" ? (
                                <div className="text-sm">
                                  Total: {totals[category].total}
                                </div>
                              ) : (
                                <div className="text-sm">
                                  H: {totals[category].hombres}
                                  <br />
                                  M: {totals[category].mujeres}
                                  <br />
                                  T: {totals[category].total}
                                </div>
                              )
                            ) : (
                              ""
                            )}
                          </TableCell>
                        ))}
                        {categoriasPreguntas.map((category) => (
                          <TableCell key={`${institution.id}-${category}`}>
                            {institution.cuestionariosData?.preguntas
                              .filter(
                                (pregunta: any) =>
                                  pregunta.categoriaPersona?.descripcion ===
                                  category,
                              )
                              .map((pregunta: any) => (
                                <div key={pregunta.id} className="text-sm">
                                  H: {pregunta.cantidadHombres} <br />
                                  M: {pregunta.cantidadMujeres} <br />
                                  T:{" "}
                                  {pregunta.cantidadHombres +
                                    pregunta.cantidadMujeres}
                                </div>
                              ))}
                          </TableCell>
                        ))}
                        {especialidades.map((especialidad) => {
                          const especialidadData =
                            institution.cuestionariosData?.especialidades.find(
                              (e: any) =>
                                e.especialidadLista.descripcion ===
                                especialidad,
                            );
                          return (
                            <TableCell
                              key={`${institution.id}-${especialidad}`}
                            >
                              {especialidadData ? (
                                <div className="text-sm">
                                  H: {especialidadData.hombres}
                                  <br />
                                  M: {especialidadData.mujeres}
                                  <br />
                                  T:{" "}
                                  {especialidadData.hombres +
                                    especialidadData.mujeres}
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell className="font-medium">Totales</TableCell>
                    <TableCell colSpan={8}></TableCell>
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
                    {categoriasPreguntas.map((category) => {
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
                    {especialidades.map((especialidad) => {
                      const total = results.reduce(
                        (acc, institution) => {
                          const esp =
                            institution.cuestionariosData?.especialidades.find(
                              (e: any) =>
                                e.especialidadLista.descripcion ===
                                especialidad,
                            );
                          return {
                            hombres: acc.hombres + (esp?.hombres || 0),
                            mujeres: acc.mujeres + (esp?.mujeres || 0),
                          };
                        },
                        { hombres: 0, mujeres: 0 },
                      );

                      return (
                        <TableCell key={`total-${especialidad}`}>
                          <div className="text-sm">
                            H: {total.hombres}
                            <br />
                            M: {total.mujeres}
                            <br />
                            T: {total.hombres + total.mujeres}
                          </div>
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
                totals={Object.fromEntries(
                  categoriasPreguntas.map((category) => [
                    category,
                    calculateOverallTotals(results)[category] || {
                      hombres: 0,
                      mujeres: 0,
                      total: 0,
                    },
                  ]),
                )}
                title="Totales por Categoría de Preguntas"
                showChart={false}
              />
              <TotalsCard
                totals={Object.fromEntries(
                  categoriasGenerales.map((category) => [
                    category,
                    calculateOverallTotals(results)[category] || {
                      hombres: 0,
                      mujeres: 0,
                      total: 0,
                    },
                  ]),
                )}
                title="Totales por Categoría General"
                showChart={false}
              />
              <TotalsCard
                totals={Object.fromEntries(
                  especialidades.map((especialidad) => [
                    especialidad,
                    results.reduce(
                      (acc, institution) => {
                        const esp =
                          institution.cuestionariosData?.especialidades.find(
                            (e: any) =>
                              e.especialidadLista.descripcion === especialidad,
                          );
                        return {
                          hombres: acc.hombres + (esp?.hombres || 0),
                          mujeres: acc.mujeres + (esp?.mujeres || 0),
                          total:
                            acc.total +
                            (esp?.hombres || 0) +
                            (esp?.mujeres || 0),
                        };
                      },
                      { hombres: 0, mujeres: 0, total: 0 },
                    ),
                  ]),
                )}
                title="Totales por Especialidad"
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
                {Math.ceil(results.length / itemsPerPage)}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(results.length / itemsPerPage)
                }
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
