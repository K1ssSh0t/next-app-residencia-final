"use client";

import { startTransition, useActionState } from "react";
import { updateInstitucione, UpdateInstitucioneState } from "@/actions/private/instituciones/update-institucione";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";
import { Checkbox } from "@/components/ui/checkbox";

import { Institucione } from "@/schema/instituciones";
import { TipoInstitucione } from "@/schema/tipo-instituciones";
import { TipoBachillere } from "@/schema/tipo-bachilleres";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InstitucioneUpdateForm({
  institucione,
  tipoInstitucioneList,
  tipoBachillereList,
  nivelEducativo,
}: {
  institucione: Institucione;
  tipoInstitucioneList: TipoInstitucione[];
  tipoBachillereList: TipoBachillere[];
  nivelEducativo: boolean;
}) {
  const initialState: UpdateInstitucioneState = {};
  const [state, dispatch] = useActionState(updateInstitucione, initialState);

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
        <input type="hidden" name="id" value={institucione.id} />
        <div>
          <p><strong>Id:</strong> {institucione.id}</p>
        </div>
        <div>
          <Label>Nombre</Label>
          <Input name="nombre" defaultValue={institucione.nombre ?? ""} />
          {state.errors?.nombre?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Region</Label>
          <Input name="region" defaultValue={institucione.region ?? ""} />
          {state.errors?.region?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Municipio</Label>
          <Input name="municipio" defaultValue={institucione.municipio ?? ""} />
          {state.errors?.municipio?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tipo de Institucion</Label>
          <GenericCombobox
            list={tipoInstitucioneList}
            name="tipoInstitucionesId"
            valueField="id"
            defaultValue={institucione.tipoInstitucionesId}
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
          <Label>Tipo de Bachiller</Label>
          <GenericCombobox
            list={tipoBachillereList}
            name="tipoBachilleresId"
            valueField="id"
            defaultValue={institucione.tipoBachilleresId}
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
        <div>
          <Label>Nivel Educativo</Label>
          <Select name="nivelEducativo" defaultValue={institucione.nivelEducativo ? "true" : "false"} disabled={true}>
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
        <div className="hidden">
          <Label>Users Id</Label>
          <Input name="usersId" defaultValue={institucione.usersId ?? ""} />
          {state.errors?.usersId?.map((error) => (
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
