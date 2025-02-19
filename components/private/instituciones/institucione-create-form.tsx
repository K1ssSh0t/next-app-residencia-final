"use client";

import { startTransition, useActionState, useState, useEffect } from "react";
import { createInstitucione, CreateInstitucioneState } from "@/actions/private/instituciones/create-institucione";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoInstituciones } from "@/schema/tipo-instituciones";
import { TipoBachilleres } from "@/schema/tipo-bachilleres";
import { Region } from "@/schema/regions";
import { Municipio } from "@/schema/municipios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Info } from "lucide-react";
import { Modalidad } from "@/schema/modalidads";
import Swal from "sweetalert2";

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children}
      <span className="text-destructive ml-1">*</span>
    </Label>
  );
}

export function InstitucioneCreateForm({
  tipoInstitucioneList,
  tipoBachillereList,
  nivelEducativo,
  regionList,
  municipioList,
  modalidadList
}: {
  tipoInstitucioneList: TipoInstituciones[];
  tipoBachillereList: TipoBachilleres[];
  nivelEducativo: boolean;
  regionList: Region[];
  municipioList: Municipio[];
  modalidadList: Modalidad[];
}) {
  const initialState: CreateInstitucioneState = {};
  const [state, dispatch] = useActionState(createInstitucione, initialState);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filteredMunicipios, setFilteredMunicipios] = useState<Municipio[]>(municipioList);
  const [selectedTipoBachiller, setSelectedTipoBachiller] = useState<TipoBachilleres | null>(null);
  const [showNumeroCarreras, setShowNumeroCarreras] = useState(true);


  useEffect(() => {
    if (selectedRegion) {
      const filtered = municipioList.filter(municipio => municipio.regionId === selectedRegion);
      setFilteredMunicipios(filtered);
    } else {
      setFilteredMunicipios(municipioList);
    }
  }, [selectedRegion, municipioList]);

  useEffect(() => {
    setShowNumeroCarreras(nivelEducativo || (selectedTipoBachiller?.descripcion === 'Tecnologico'));
  }, [nivelEducativo, selectedTipoBachiller]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const nivelEducativoForm = formData.get('nivelEducativo');
    console.log(formData.get('nivelEducativo'))
    console.log(formData)
    formData.set('nivelEducativo', nivelEducativoForm === 'true' ? 'true' : 'false');

    if (nivelEducativo) {
      formData.delete('tipoBachilleresId');
    }
    startTransition(() => dispatch(formData));
    Swal.fire({
      title: "Guardado",
      text: "Se han guardado los datos.",
      icon: "success",
      confirmButtonColor: "#631233",
      timer: 2000, 
      timerProgressBar: true
      
    });
    
  }

  function handleRegionChange(value: string) {
    setSelectedRegion(value);
  }

  function handleTipoBachillerChange(value: string) {
    const selectedTipo = tipoBachillereList.find(tipo => tipo.id === value);
    setSelectedTipoBachiller(selectedTipo || null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Institución</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-700">Los campos que son requeridos son marcados con un asterisco (<span className="text-red-500">*</span>)</p>
        </div>
        <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="nombre">Nombre <span className="text-red-500">*</span></Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-destructive cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Por favor, para ingresar el nombre tome en cuenta las indicaciones de su administrador.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input name="nombre" required placeholder="Ingresa el Nombre de la Institución" id="nombre" />
              {state.errors?.nombre?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="claveInstitucion">Clave de Institución <span className="text-red-500">*</span></Label>
              <Input name="claveInstitucion" required placeholder="Ingresa la Clave de la Institución" id="claveInstitucion" />
              {state.errors?.claveInstitucion?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="claveCentroTrabajo">Clave de Centro de Trabajo <span className="text-red-500">*</span></Label>
              <Input name="claveCentroTrabajo" required placeholder="Ingresa la Clave del Centro de Trabajo" id="claveCentroTrabajo" />
              {state.errors?.claveCentroTrabajo?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>
            {
              !nivelEducativo &&
              <div className="space-y-2">
                <Label htmlFor="tipoBachilleresId">Modalidad <span className="text-red-500">*</span></Label>
                <GenericCombobox
                  name="modalidadesId"
                  list={modalidadList}
                  valueField="id"
                  searchPlaceholder="Buscar Modalidad..."
                  selectPlaceholder="Seleccionar Modalidad..."
                  emptyText="No se encontró la modalidad"
                  keywordFields={["id", "descripcion"]}
                  template={(item) => <div aria-required id="modalidadesId">{item.descripcion}</div>}
                />
                {state.errors?.modalidadesId?.map((error) => (
                  <p className="text-destructive text-sm" key={error}>{error}</p>
                ))}
              </div>
            }

            {showNumeroCarreras &&
              <div className="space-y-2">

                <div className="flex items-center gap-2">


                  <RequiredLabel>{nivelEducativo ? "Número de Carreras, Postgrados y Doctorados" : "Formacion Educativa"}</RequiredLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-destructive cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Por favor, considere sumar la cantidad de carreras totales de la institución, postgrados, doctorados y maestrias para determinar el número que colocará.
                          <br />
                          Para Media Superior solo coloque su cantidad de Formaciones Educativas.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input name="numeroCarreras" type="number" required={showNumeroCarreras} min={0} placeholder={nivelEducativo ? "Ingresa el Número de Carreras" : "Ingresa la Formación Educativa"} />
                {state.errors?.numeroCarreras?.map((error) => (
                  <p className="text-destructive text-sm" key={error}>{error}</p>
                ))}
              </div>}

            <div className="space-y-2">
              <Label htmlFor="region">Región <span className="text-red-500">*</span></Label>
              <GenericCombobox

                list={regionList}
                name="region"
                valueField="id"
                searchPlaceholder="Buscar Región..."
                selectPlaceholder="Seleccionar Región..."
                emptyText="No se encontró la región"
                keywordFields={["id", "nombre"]}
                template={(item) => <div aria-required id="region">{item.nombre}</div>}
                onChange={(value) => setSelectedRegion(value)}
              />
              {state.errors?.region?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipio">Municipio <span className="text-red-500">*</span></Label>
              <GenericCombobox

                list={filteredMunicipios}
                name="municipio"
                valueField="id"
                searchPlaceholder="Buscar Municipio..."
                selectPlaceholder="Seleccionar Municipio..."
                emptyText="No se encontró el municipio"
                keywordFields={["id", "nombre"]}
                template={(item) => <div aria-required id="municipio">{item.nombre}</div>}
              />
              {state.errors?.municipio?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoInstitucionesId">Tipo de Institución <span className="text-red-500">*</span></Label>
              <GenericCombobox

                list={tipoInstitucioneList}
                name="tipoInstitucionesId"
                valueField="id"
                searchPlaceholder="Buscar Tipo de Institución..."
                selectPlaceholder="Seleccionar Tipo de Institución..."
                emptyText="No se encontró el tipo de institución"
                keywordFields={["id", "descripcion"]}
                template={(item) => <div aria-required id="tipoInstitucionesId">{item.descripcion}</div>}
              />
              {state.errors?.tipoInstitucionesId?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            {!nivelEducativo && (
              <div className="space-y-2">
                <Label>Tipo de Bachiller <span className="text-red-500">*</span></Label>
                <GenericCombobox
                  list={tipoBachillereList}
                  name="tipoBachilleresId"
                  valueField="id"
                  searchPlaceholder="Buscar Tipo de Bachillerato..."
                  selectPlaceholder="Seleccionar Tipo de Bachillerato..."
                  emptyText="No se encontró el tipo de bachillerato"
                  keywordFields={["id", "descripcion"]}
                  template={(item) => <div>{item.descripcion}</div>}
                  onChange={handleTipoBachillerChange}
                />
                {state.errors?.tipoBachilleresId?.map((error) => (
                  <p className="text-destructive text-sm" key={error}>{error}</p>
                ))}
              </div>
            )}

            <div className="space-y-2 hidden">
              <Label>Nivel Educativo</Label>
              <Select
                name="nivelEducativo"
                defaultValue={nivelEducativo ? "true" : "false"}

              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el nivel educativo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Superior</SelectItem>
                  <SelectItem value="false">Medio Superior</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.nivelEducativo?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" className="w-full sm:w-auto">
              Crear Institución
            </Button>
          </div>
          <FormAlert state={state} />
        </form>
      </CardContent>
    </Card>
  );
}

