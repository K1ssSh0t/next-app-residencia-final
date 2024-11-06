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

export function InstitucioneCreateForm({
  tipoInstitucioneList,
  tipoBachillereList,
}: {
  tipoInstitucioneList: TipoInstitucione[];
  tipoBachillereList: TipoBachillere[];
}) {
  const initialState: CreateInstitucioneState = {};
  const [state, dispatch] = useActionState(createInstitucione, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
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
          <Input name="region" />
          {state.errors?.region?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Municipio</Label>
          <Input name="municipio" />
          {state.errors?.municipio?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tipo Instituciones Id</Label>
          <GenericCombobox
            list={ tipoInstitucioneList }
            name="tipoInstitucionesId"
            valueField="id"
            searchPlaceholder="Search Tipo Instituciones..."
            selectPlaceholder="Select Tipo Institucione..."
            emptyText="No tipoInstitucione found"
            keywordFields={["id"]}
            template={(item) => <div>{item.id}</div>}
          />
          {state.errors?.tipoInstitucionesId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tipo Bachilleres Id</Label>
          <GenericCombobox
            list={ tipoBachillereList }
            name="tipoBachilleresId"
            valueField="id"
            searchPlaceholder="Search Tipo Bachilleres..."
            selectPlaceholder="Select Tipo Bachillere..."
            emptyText="No tipoBachillere found"
            keywordFields={["id"]}
            template={(item) => <div>{item.id}</div>}
          />
          {state.errors?.tipoBachilleresId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label>Users Id</Label>
          <Input name="usersId" />
          {state.errors?.usersId?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label className="mr-2">Nivel Educativo</Label>
          <Checkbox name="nivelEducativo" />
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
