"use client";

import { startTransition, useActionState } from "react";
import { createMunicipio, CreateMunicipioState } from "@/actions/admin/municipios/create-municipio";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";

import { Region } from "@/schema/regions";

export function MunicipioCreateForm({
  regionList,
}: {
  regionList: Region[];
}) {
  const initialState: CreateMunicipioState = {};
  const [state, dispatch] = useActionState(createMunicipio, initialState);

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
        <div className="flex flex-col gap-2">
          <Label>Region Id</Label>
          <GenericCombobox
            list={ regionList }
            name="regionId"
            valueField="id"
            searchPlaceholder="Search Regions..."
            selectPlaceholder="Select Region..."
            emptyText="No region found"
            keywordFields={["id"]}
            template={(item) => <div>{item.id}</div>}
          />
          {state.errors?.regionId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
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
