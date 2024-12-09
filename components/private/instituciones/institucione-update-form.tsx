"use client";

import { startTransition, useActionState, useState, useEffect } from "react";
import { updateInstitucione, UpdateInstitucioneState } from "@/actions/private/instituciones/update-institucione";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Institucion } from "@/schema/instituciones";
import { TipoInstituciones } from "@/schema/tipo-instituciones";
import { TipoBachilleres } from "@/schema/tipo-bachilleres";
import { Region } from "@/schema/regions";
import { Municipio } from "@/schema/municipios";


function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children}
      <span className="text-destructive ml-1">*</span>
    </Label>
  );
}


export function InstitucioneUpdateForm({
  institucion,
  tipoInstitucioneList,
  tipoBachillereList,
  nivelEducativo,
  regionList,
  municipioList,
}: {
  institucion: Institucion;
  tipoInstitucioneList: TipoInstituciones[];
  tipoBachillereList: TipoBachilleres[];
  nivelEducativo: boolean;
  regionList: Region[];
  municipioList: Municipio[];
}) {
  const initialState: UpdateInstitucioneState = {};
  const [state, dispatch] = useActionState(updateInstitucione, initialState);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(institucion.regionId || null);
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

  useEffect(() => {
    const selectedTipoBachiller = tipoBachillereList.find(tipo => tipo.id === institucion.tipoBachilleresId);
    setSelectedTipoBachiller(selectedTipoBachiller || null);
  }, [institucion]);

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
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="id" value={institucion.id} />
        {/* <div>
          <p><strong>Id:</strong> {institucione.id}</p>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <RequiredLabel>Nombre</RequiredLabel>
            <Input name="nombre" defaultValue={institucion.nombre ?? ""} required />
            {state.errors?.nombre?.map((error) => (
              <p className="text-destructive text-sm" key={error}>{error}</p>
            ))}
          </div>

          <div className="space-y-2">
            <RequiredLabel>Clave de Institución</RequiredLabel>
            <Input name="claveInstitucion" defaultValue={institucion.claveInstitucion ?? ""} required />
            {state.errors?.claveInstitucion?.map((error) => (
              <p className="text-destructive text-sm" key={error}>{error}</p>
            ))}
          </div>

          <div className="space-y-2">
            <RequiredLabel>Clave de Centro de Trabajo</RequiredLabel>
            <Input name="claveCentroTrabajo" defaultValue={institucion.claveCentroTrabajo ?? ""} required />
            {state.errors?.claveCentroTrabajo?.map((error) => (
              <p className="text-destructive text-sm" key={error}>{error}</p>
            ))}
          </div>

          {showNumeroCarreras && <div className="space-y-2">
            <Label>{nivelEducativo ? "Número de Carreras" : "Formacion Educativa"}</Label>
            <Input
              name="numeroCarreras"
              type="number"
              defaultValue={institucion.numeroCarreras ?? ""}
            />
            {state.errors?.numeroCarreras?.map((error) => (
              <p className="text-destructive text-sm" key={error}>{error}</p>
            ))}
          </div>
          }
          <div className="space-y-2">
            <RequiredLabel>Región</RequiredLabel>
            <GenericCombobox

              list={regionList}
              name="region"
              valueField="id"
              defaultValue={institucion.regionId}
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
              defaultValue={institucion.municipioId}
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
              defaultValue={institucion.tipoInstitucionesId}
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

          <div className="hidden">
            <Label>Users Id</Label>
            <Input name="usersId" defaultValue={institucion.usersId ?? ""} />
            {state.errors?.usersId?.map((error) => (
              <p className="text-red-500" key={error}>{error}</p>
            ))}
          </div>

          {!nivelEducativo && (
            <div className="space-y-2">
              <Label>Tipo de Bachiller</Label>
              <GenericCombobox
                list={tipoBachillereList}
                name="tipoBachilleresId"
                valueField="id"
                defaultValue={institucion.tipoBachilleresId}
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

          <div className="hidden">
            <Label>Nivel Educativo</Label>
            <Select name="nivelEducativo" defaultValue={institucion.nivelEducativo ? "true" : "false"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el nivel educativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Superior</SelectItem>
                <SelectItem value="false">Medio Superior</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.nivelEducativo?.map((error) => (
              <p className="text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="submit" className="w-full sm:w-auto">
            Actualizar Institución
          </Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}

