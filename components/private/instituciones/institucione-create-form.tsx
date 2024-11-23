"use client";

import { startTransition, useActionState, useState, useEffect } from "react";
import { createInstitucione, CreateInstitucioneState } from "@/actions/private/instituciones/create-institucione";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoInstitucione } from "@/schema/tipo-instituciones";
import { TipoBachillere } from "@/schema/tipo-bachilleres";
import { Region } from "@/schema/regions";
import { Municipio } from "@/schema/municipios";

export function InstitucioneCreateForm({
  tipoInstitucioneList,
  tipoBachillereList,
  nivelEducativo,
  regionList,
  municipioList,
}: {
  tipoInstitucioneList: TipoInstitucione[];
  tipoBachillereList: TipoBachillere[];
  nivelEducativo: boolean;
  regionList: Region[];
  municipioList: Municipio[];
}) {
  const initialState: CreateInstitucioneState = {};
  const [state, dispatch] = useActionState(createInstitucione, initialState);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filteredMunicipios, setFilteredMunicipios] = useState<Municipio[]>(municipioList);

  useEffect(() => {
    if (selectedRegion) {
      const filtered = municipioList.filter(municipio => municipio.regionId === selectedRegion);
      setFilteredMunicipios(filtered);
    } else {
      setFilteredMunicipios(municipioList);
    }
  }, [selectedRegion, municipioList]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const nivelEducativoForm = formData.get('nivelEducativo');
    formData.set('nivelEducativo', nivelEducativoForm === 'true' ? 'true' : 'false');

    if (nivelEducativo) {
      formData.delete('tipoBachilleresId');
    }

    startTransition(() => dispatch(formData));
  }

  function handleRegionChange(value: string) {
    setSelectedRegion(value);
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Nombre</Label>
          <Input name="nombre" />
          {state.errors?.nombre?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Clave Institucion</Label>
          <Input name="claveInstitucion" />
          {state.errors?.claveInstitucion?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Clave Centro de Trabajo</Label>
          <Input name="claveCentroTrabajo" />
          {state.errors?.claveCentroTrabajo?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Region</Label>
          <GenericCombobox
            list={regionList}
            name="region"
            valueField="id"
            searchPlaceholder="Buscar Región..."
            selectPlaceholder="Seleccionar Región..."
            emptyText="No se encontró la región"
            keywordFields={["id", "nombre"]}
            template={(item) => <div>{item.nombre}</div>}
            onChange={handleRegionChange}

          />
          {state.errors?.region?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Municipio</Label>
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
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tipo Instituciones Id</Label>
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
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        {!nivelEducativo && (
          <div className="flex flex-col gap-2">
            <Label>Tipo Bachilleres Id</Label>
            <GenericCombobox
              list={tipoBachillereList}
              name="tipoBachilleresId"
              valueField="id"
              searchPlaceholder="Buscar Tipo de Bachillerato..."
              selectPlaceholder="Seleccionar Tipo de Bachillerato..."
              emptyText="No se encontró el tipo de bachillerato"
              keywordFields={["id", "descripcion"]}
              template={(item) => <div>{item.descripcion}</div>}
            />
            {state.errors?.tipoBachilleresId?.map((error) => (
              <p className="text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
        <div>
          <Label className="mr-2">Nivel Educativo</Label>
          <Select name="nivelEducativo" defaultValue={nivelEducativo ? "true" : "false"} disabled={true}>
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
        <div>
          <Label>Numero de Carreras</Label>
          <Input name="numeroCarreras" type="number" />
          {state.errors?.numeroCarreras?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}

