"use client";

import { startTransition, useActionState } from "react";
import { createPregunta, CreatePreguntaState } from "@/actions/private/preguntas/create-pregunta";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { GenericCombobox } from "@/components/generic-combobox";
import { Input } from "@/components/ui/input";

import { CategoriaPersona } from "@/schema/categoria-personas";

export function PreguntaCreateForm({
  categoriaPersonaList,
  cuestionario
}: {
  categoriaPersonaList: CategoriaPersona[];
  cuestionario: string;
}) {
  const initialState: CreatePreguntaState = {};
  const [state, dispatch] = useActionState(createPregunta, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }



  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Label>Categoria Personas Id</Label>
          <GenericCombobox
            list={categoriaPersonaList}
            name="categoriaPersonasId"
            valueField="id"
            searchPlaceholder="Search Categoria Personas..."
            selectPlaceholder="Select Categoria Persona..."
            emptyText="No categoriaPersona found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div>{item.descripcion}</div>}
          />
          {state.errors?.categoriaPersonasId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div className="hidden">
          <Label>{cuestionario}</Label>
          <Input name="cuestionariosId" defaultValue={cuestionario} />
          {state.errors?.cuestionariosId?.map((error) => (
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
          <Label>Cantidad Hombres</Label>
          <Input name="cantidadHombres" />
          {state.errors?.cantidadHombres?.map((error) => (
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
