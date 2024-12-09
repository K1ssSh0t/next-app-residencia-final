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
}: {
  tipoInstitucioneList: TipoInstituciones[];
  tipoBachillereList: TipoBachilleres[];
  nivelEducativo: boolean;
  regionList: Region[];
  municipioList: Municipio[];
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
        <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <RequiredLabel>Nombre</RequiredLabel>
              <Input name="nombre" required placeholder="Ingresa el Nombre de la Institución" />
              {state.errors?.nombre?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            <div className="space-y-2">
              <RequiredLabel>Clave de Institución</RequiredLabel>
              <Input name="claveInstitucion" required placeholder="Ingresa la Clave de la Institución" />
              {state.errors?.claveInstitucion?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            <div className="space-y-2">
              <RequiredLabel>Clave de Centro de Trabajo</RequiredLabel>
              <Input name="claveCentroTrabajo" required placeholder="Ingresa la Clave del Centro de Trabajo" />
              {state.errors?.claveCentroTrabajo?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>
            {showNumeroCarreras &&
              <div className="space-y-2">
                <RequiredLabel>{nivelEducativo ? "Número de Carreras" : "Formacion Educativa"}</RequiredLabel>
                <Input name="numeroCarreras" type="number" required min={0} placeholder={nivelEducativo ? "Ingresa el Número de Carreras" : "Ingresa la Formación Educativa"} />
                {state.errors?.numeroCarreras?.map((error) => (
                  <p className="text-destructive text-sm" key={error}>{error}</p>
                ))}
              </div>}

            <div className="space-y-2">
              <RequiredLabel>Región</RequiredLabel>
              <GenericCombobox

                list={regionList}
                name="region"
                valueField="id"
                searchPlaceholder="Buscar Región..."
                selectPlaceholder="Seleccionar Región..."
                emptyText="No se encontró la región"
                keywordFields={["id", "nombre"]}
                template={(item) => <div>{item.nombre}</div>}
                onChange={(value) => setSelectedRegion(value)}
              />
              {state.errors?.region?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            <div className="space-y-2">
              <RequiredLabel>Municipio</RequiredLabel>
              <GenericCombobox

                list={filteredMunicipios}
                name="municipio"
                valueField="id"
                searchPlaceholder="Buscar Municipio..."
                selectPlaceholder="Seleccionar Municipio..."
                emptyText="No se encontró el municipio"
                keywordFields={["id", "nombre"]}
                template={(item) => <div>{item.nombre}</div>}
              />
              {state.errors?.municipio?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            <div className="space-y-2">
              <RequiredLabel>Tipo de Institución</RequiredLabel>
              <GenericCombobox

                list={tipoInstitucioneList}
                name="tipoInstitucionesId"
                valueField="id"
                searchPlaceholder="Buscar Tipo de Institución..."
                selectPlaceholder="Seleccionar Tipo de Institución..."
                emptyText="No se encontró el tipo de institución"
                keywordFields={["id", "descripcion"]}
                template={(item) => <div>{item.descripcion}</div>}
              />
              {state.errors?.tipoInstitucionesId?.map((error) => (
                <p className="text-destructive text-sm" key={error}>{error}</p>
              ))}
            </div>

            {!nivelEducativo && (
              <div className="space-y-2">
                <Label>Tipo de Bachiller</Label>
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

