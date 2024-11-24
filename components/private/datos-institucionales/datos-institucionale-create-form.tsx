"use client";

import { startTransition, useActionState } from "react";
import { createDatosInstitucionale, CreateDatosInstitucionaleState } from "@/actions/private/datos-institucionales/create-datos-institucionale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";

import { CategoriasGenerale } from "@/schema/categorias-generales";

export function DatosInstitucionaleCreateForm({
  categoriasGeneraleList,
}: {
  categoriasGeneraleList: CategoriasGenerale[];
}) {
  const initialState: CreateDatosInstitucionaleState = {};
  const [state, dispatch] = useActionState(createDatosInstitucionale, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Instituciones Id</Label>
          <Input name="institucionesId" />
          {state.errors?.institucionesId?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Categorias Generales Id</Label>
          <GenericCombobox
            list={categoriasGeneraleList}
            name="categoriasGeneralesId"
            valueField="id"
            searchPlaceholder="Search Categorias Generales..."
            selectPlaceholder="Select Categorias Generale..."
            emptyText="No categoriasGenerale found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div>{item.descripcion}</div>}
          />
          {state.errors?.categoriasGeneralesId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label>Cantidad Hombres</Label>
          <Input name="cantidadHombres" />
          {state.errors?.cantidadHombres?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Cantidad Mujeres</Label>
          <Input name="cantidadMujeres" />
          {state.errors?.cantidadMujeres?.map((error) => (
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
