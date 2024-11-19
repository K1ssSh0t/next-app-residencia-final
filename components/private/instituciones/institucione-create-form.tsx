"use client";

import { startTransition, useActionState } from "react";
import { createInstitucione, CreateInstitucioneState } from "@/actions/private/instituciones/create-institucione";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";
import { Checkbox } from "@/components/ui/checkbox";

import { TipoInstitucione } from "@/schema/tipo-instituciones";
import { TipoBachillere } from "@/schema/tipo-bachilleres";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Region } from "@/schema/regions";
import { Municipio } from "@/schema/municipios";
import { Modalidad } from "@/schema/modalidads";

export function InstitucioneCreateForm({
  tipoInstitucioneList,
  tipoBachillereList,
  nivelEducativo,
  regionList,
  municipioList,
  modalidadList,
}: {
  tipoInstitucioneList: TipoInstitucione[];
  tipoBachillereList: TipoBachillere[];
  nivelEducativo: boolean;
  regionList: Region[];
  municipioList: Municipio[];
  modalidadList: Modalidad[];
}) {
  const initialState: CreateInstitucioneState = {};
  const [state, dispatch] = useActionState(createInstitucione, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);


    // Convert 'nivelEducativo' to boolean before dispatching
    const nivelEducativoForm = formData.get('nivelEducativo');
    formData.set('nivelEducativo', nivelEducativoForm === 'true' ? 'true' : 'false');


    // Si es nivel superior, eliminamos el campo tipoBachilleresId
    if (nivelEducativo) {
      formData.delete('tipoBachilleresId');
    }


    startTransition(() => dispatch(formData));
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
          <Label>Region</Label>
          <GenericCombobox
            list={regionList}
            name="region"
            valueField="id"
            searchPlaceholder="Search Tipo Instituciones..."
            selectPlaceholder="Select Tipo Institucione..."
            emptyText="No tipoInstitucione found"
            keywordFields={["id", "nombre"]}
            template={(item) => <div>{item.nombre}</div>}
          />
          {state.errors?.region?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Municipio</Label>
          <GenericCombobox
            list={municipioList}
            name="municipio"
            valueField="id"
            searchPlaceholder="Search Tipo Instituciones..."
            selectPlaceholder="Select Tipo Institucione..."
            emptyText="No tipoInstitucione found"
            keywordFields={["id", "nombre"]}
            template={(item) => <div>{item.nombre}</div>}
          />
          {state.errors?.municipio?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Modalidad</Label>
          <GenericCombobox
            list={modalidadList}
            name="modalidad"
            valueField="id"
            searchPlaceholder="Search Tipo Instituciones..."
            selectPlaceholder="Select Tipo Institucione..."
            emptyText="No tipoInstitucione found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div>{item.descripcion}</div>}
          />
          {state.errors?.modalidad?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tipo Instituciones Id</Label>
          <GenericCombobox
            list={tipoInstitucioneList}
            name="tipoInstitucionesId"
            valueField="id"
            searchPlaceholder="Search Tipo Instituciones..."
            selectPlaceholder="Select Tipo Institucione..."
            emptyText="No tipoInstitucione found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div>{item.descripcion}</div>}
          />
          {state.errors?.tipoInstitucionesId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        {!nivelEducativo && (<div className="flex flex-col gap-2">
          <Label>Tipo Bachilleres Id</Label>
          <GenericCombobox
            list={tipoBachillereList}
            name="tipoBachilleresId"
            valueField="id"
            searchPlaceholder="Search Tipo Bachilleres..."
            selectPlaceholder="Select Tipo Bachillere..."
            emptyText="No tipoBachillere found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div>{item.descripcion}</div>}
          />
          {state.errors?.tipoBachilleresId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>)}
        {/* <div>
          <Label>Users Id</Label>
          <Input name="usersId" />
          {state.errors?.usersId?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div> */}
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
          <Button type="submit">Submit</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
