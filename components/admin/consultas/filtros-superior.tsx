"use client"

import * as React from "react"

import { Check, ChevronsUpDown, Search, Loader2, Download } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { InstitucionesBusqueda, buscarSuperior } from "@/actions/admin/consultas/buscar-instituciones-superior"
import { Institucion } from "@/schema/instituciones"
import { Card, CardContent } from "@/components/ui/card"
import { InstitucionesWithRelations } from "@/repositories/institucione-repository"

interface Option {
    regionId?: string | null
    value: string
    label: string | null
}

interface FilterOptions {
    regions: Option[]
    municipalities: Option[]
    institutionTypes: Option[]
    careers?: Option[]
    modalities?: Option[]
    institutions?: Option[]
}

const convertToCSV = (data: InstitucionesBusqueda, categoriasCuestionario: string[], categoriasGenerales: string[]) => {
    const headers = [
        'Nombre Carrera',
        'REVOE',
        'Número REVOE',
        'Institución',
        'Tipo de Institución',
        'Modalidad',
        'Región',
        'Municipio',
        ...categoriasCuestionario.map(c => `${c}_Hombres,${c}_Mujeres,${c}_Total`),
        ...categoriasGenerales.map(c => `${c}_Hombres,${c}_Mujeres,${c}_Total`)
    ].join(',');

    const rows = data.flatMap(institution =>
        institution.cuestionario?.map(cuestionario => {
            const basicInfo = [
                cuestionario.carrera?.carrera?.descripcion || '',
                cuestionario.carrera?.nombreRevoe || '',
                cuestionario.carrera?.numeroRevoe || '',
                institution.nombre || '',
                institution.tipoInstituciones?.descripcion || '',
                cuestionario.carrera?.modalidad?.descripcion || '',
                institution.region?.nombre || '',
                institution.municipio?.nombre || ''
            ];

            const cuestionarioData = categoriasCuestionario.map(category => {
                const pregunta = cuestionario.preguntas.find(
                    p => p.categoriaPersona?.descripcion === category
                );
                const h = pregunta?.cantidadHombres || 0;
                const m = pregunta?.cantidadMujeres || 0;
                return `${h},${m},${h + m}`;
            });

            const datosInstitucionales = categoriasGenerales.map(category => {
                const dato = institution.datosInstitucionales?.find(
                    d => d.categoriasGenerales?.descripcion === category
                );
                const h = dato?.cantidadHombres || 0;
                const m = dato?.cantidadMujeres || 0;
                return `${h},${m},${h + m}`;
            });

            return [...basicInfo, ...cuestionarioData, ...datosInstitucionales].join(',');
        })
    ).filter(Boolean);

    return `${headers}\n${rows.join('\n')}`;
};

export function ComboboxFilter({
    options,
    placeholder = "Seleccionar",
    value,
    onChange,
}: {
    options: Option[]
    placeholder?: string
    value: string
    onChange: (value: string) => void
}) {
    const [open, setOpen] = React.useState(false)

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
                    <CommandInput placeholder={`Buscar ${placeholder.toLowerCase()}...`} />
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                    onChange(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )} />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export function FiltrosSuperior({ filterOptions }: { filterOptions: FilterOptions }) {
    const [selectedRegion, setSelectedRegion] = React.useState("")
    const [selectedMunicipality, setSelectedMunicipality] = React.useState("")
    const [selectedInstitutionType, setSelectedInstitutionType] = React.useState("")
    const [nombreInstitucion, setNombreInstitucion] = React.useState("")
    const [selectedCareer, setSelectedCareer] = React.useState("")
    const [selectedModality, setSelectedModality] = React.useState("")
    const [results, setResults] = React.useState<InstitucionesBusqueda>()
    const [categoriasCuestionario, setCategoriasCuestionario] = React.useState<string[]>([])
    const [categoriasGenerales, setCategoriasGenerales] = React.useState<string[]>([])
    const [error, setError] = React.useState<string | null>(null)
    const [isPending, startTransition] = React.useTransition()

    const [filteredMunicipalities, setFilteredMunicipalities] = React.useState(filterOptions.municipalities);

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedResults = results?.flatMap(institution =>
        institution.cuestionario?.map(cuestionario => ({ institution, cuestionario }))
    ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    React.useEffect(() => {
        if (selectedRegion) {
            const municipiosFiltrados = filterOptions.municipalities.filter(municipio => municipio.regionId === selectedRegion);
            setFilteredMunicipalities(municipiosFiltrados);
        } else {
            setFilteredMunicipalities([]);
        }
    }, [selectedRegion, filterOptions.municipalities]);


    const handleSearch = () => {
        setError(null)

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
                    institutionName: nombreInstitucion || undefined


                })
                setResults(institutions)

                // Extract unique categories
                const uniqueCategories = new Set<string>()
                const uniqueCategoriesPreguntas = new Set<string>()
                institutions.forEach(institution => {
                    institution.datosInstitucionales?.forEach(dato => {
                        if (dato.categoriasGenerales?.descripcion) {
                            uniqueCategories.add(dato.categoriasGenerales.descripcion)
                        }
                    })
                    institution.cuestionario?.forEach((cuestionario: any) => {
                        cuestionario.preguntas.forEach((pregunta: any) => {
                            if (pregunta.categoriaPersona?.descripcion) {
                                uniqueCategoriesPreguntas.add(pregunta.categoriaPersona.descripcion)
                            }

                        });
                    })
                })
                setCategoriasCuestionario(Array.from(uniqueCategoriesPreguntas))
                setCategoriasGenerales(Array.from(uniqueCategories))

            } catch (err) {
                setError("Error al buscar instituciones")
            }
        })
    }

    const handleExportFiltered = () => {
        if (!results) return;
        const csv = convertToCSV(results, categoriasCuestionario, categoriasGenerales);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'instituciones_superior_filtradas.csv';
        link.click();
    };

    const handleExportAll = async () => {
        try {
            const allInstitutions = await buscarSuperior({});
            const csv = convertToCSV(allInstitutions, categoriasCuestionario, categoriasGenerales);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'todas_instituciones_superior.csv';
            link.click();
        } catch (error) {
            setError("Error al exportar todas las instituciones");
        }
    };

    const calculateTotals = (institution: InstitucionesBusqueda[0]) => {
        const totals: { [key: string]: { hombres: number, mujeres: number, total: number } } = {}

        institution.datosInstitucionales?.forEach(dato => {
            const categoria = dato.categoriasGenerales?.descripcion || 'Sin categoría'
            if (!totals[categoria]) {
                totals[categoria] = { hombres: 0, mujeres: 0, total: 0 }
            }
            totals[categoria].hombres += dato.cantidadHombres || 0
            totals[categoria].mujeres += dato.cantidadMujeres || 0
            totals[categoria].total += (dato.cantidadHombres || 0) + (dato.cantidadMujeres || 0)
        })

        return totals
    }


    const calculateOverallTotals = (institutions: InstitucionesBusqueda) => {
        const overallTotals: { [key: string]: { hombres: number, mujeres: number, total: number } } = {};

        institutions.forEach(institution => {
            institution.datosInstitucionales?.forEach(dato => {
                const categoria = dato.categoriasGenerales?.descripcion || 'Sin categoría';
                if (!overallTotals[categoria]) {
                    overallTotals[categoria] = { hombres: 0, mujeres: 0, total: 0 };
                }
                overallTotals[categoria].hombres += dato.cantidadHombres || 0;
                overallTotals[categoria].mujeres += dato.cantidadMujeres || 0;
                overallTotals[categoria].total += (dato.cantidadHombres || 0) + (dato.cantidadMujeres || 0);
            });
            institution.cuestionario?.forEach((cuestionario) => {
                cuestionario?.preguntas.forEach(pregunta => {
                    const categoria = pregunta.categoriaPersona?.descripcion || 'Sin categoría';
                    if (!overallTotals[categoria]) {
                        overallTotals[categoria] = { hombres: 0, mujeres: 0, total: 0 };
                    }
                    // Assuming each question has a count of responses or similar metric
                    overallTotals[categoria].hombres += pregunta.cantidadHombres ?? 0;
                    overallTotals[categoria].mujeres += pregunta.cantidadMujeres ?? 0;
                    overallTotals[categoria].total += pregunta.cantidadHombres! + pregunta.cantidadMujeres!;
                });
            })
        });

        return overallTotals;
    };


    return (
        <div className="w-full max-w-[95vw] mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Instituciones Nivel Superior</h1>


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

                    <div className="space-y-2">
                        <label htmlFor="" className="text-sm font-medium" >Nombre de Institución</label>
                        <input type="text" value={nombreInstitucion} onChange={(e) => setNombreInstitucion(e.target.value)} className="w-full border  rounded-md p-2" />
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

            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error}
                </div>
            )}

            {!error && !isPending && results && results.length === 0 && (
                <Card className="mt-8">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                        <p className="text-sm text-muted-foreground">
                            No hay instituciones que coincidan con los criterios de búsqueda seleccionados.
                            Por favor, intente con diferentes filtros.
                        </p>
                    </CardContent>
                </Card>
            )}


            {results && results.length > 0 && (
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Resultados</h3>
                        <div className="space-x-2">
                            <Button onClick={handleExportFiltered} variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Exportar Filtrados
                            </Button>
                            <Button onClick={handleExportAll} variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Exportar Todos
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Nombre Carrera</TableHead>
                                    <TableHead>REVOE</TableHead>
                                    <TableHead>Número REVOE</TableHead>
                                    <TableHead>Institución</TableHead>
                                    <TableHead>Tipo de Institución</TableHead>
                                    <TableHead>Modalidad</TableHead>
                                    <TableHead>Región</TableHead>
                                    <TableHead>Municipio</TableHead>
                                    {categoriasCuestionario.map(category => (
                                        <TableHead key={category}>{category}</TableHead>
                                    ))}
                                    {
                                        categoriasGenerales.map(category => (
                                            <TableHead key={category}>{category}</TableHead>
                                        ))
                                    }

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedResults?.map(({ institution, cuestionario }) => (
                                    <TableRow key={cuestionario.id}>
                                        <TableCell className="font-medium">{cuestionario.carrera?.carrera?.descripcion}</TableCell>
                                        <TableCell>{cuestionario.carrera?.nombreRevoe}</TableCell>
                                        <TableCell>{cuestionario.carrera?.numeroRevoe}</TableCell>
                                        <TableCell>{institution.nombre}</TableCell>
                                        <TableCell>{institution.tipoInstituciones?.descripcion}</TableCell>
                                        <TableCell>{cuestionario.carrera?.modalidad?.descripcion}</TableCell>
                                        <TableCell>{institution.region?.nombre}</TableCell>
                                        <TableCell>{institution.municipio?.nombre}</TableCell>
                                        {categoriasCuestionario.map(category => (
                                            <TableCell key={`${cuestionario.id}-${category}`}>
                                                {cuestionario.preguntas.filter((pregunta) => pregunta.categoriaPersona?.descripcion === category).map((pregunta) => (
                                                    <div key={pregunta.id} className="text-sm">
                                                        {pregunta.cantidadHombres! + pregunta.cantidadMujeres!}
                                                    </div>
                                                ))}
                                            </TableCell>
                                        ))}
                                        {categoriasGenerales.map(category => (
                                            <TableCell key={`${cuestionario.id}-${category}`}>
                                                {institution.datosInstitucionales?.filter((dato) => dato.categoriasGenerales?.descripcion === category).map((dato) => (
                                                    <div key={dato.id} className="text-sm">
                                                        {dato.cantidadHombres! + dato.cantidadMujeres!}
                                                    </div>
                                                ))}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell className="font-medium">Totales</TableCell>
                                    <TableCell colSpan={7}></TableCell>
                                    {categoriasGenerales.map(category => {
                                        const overallTotals = calculateOverallTotals(results);
                                        return (
                                            <TableCell key={`total-${category}`}>
                                                {overallTotals[category] ? (
                                                    <div className="text-sm">
                                                        H: {overallTotals[category].hombres}<br />
                                                        M: {overallTotals[category].mujeres}<br />
                                                        T: {overallTotals[category].total}
                                                    </div>
                                                ) : '-'}
                                            </TableCell>
                                        );
                                    })}
                                    {categoriasCuestionario.map(category => {
                                        const overallTotals = calculateOverallTotals(results);
                                        return (
                                            <TableCell key={`total-${category}`}>
                                                {overallTotals[category] ? (
                                                    <div className="text-sm">
                                                        H: {overallTotals[category].hombres}<br />
                                                        M: {overallTotals[category].mujeres}<br />
                                                        T: {overallTotals[category].total}
                                                    </div>
                                                ) : '-'}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span className="mx-2">Página {currentPage} de {Math.ceil(results.flatMap(institution => institution.cuestionario || []).length / itemsPerPage)}</span>
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(results.flatMap(institution => institution.cuestionario || []).length / itemsPerPage)}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}

        </div>
    )
}

