"use client";

import { startTransition, useActionState } from "react";
import { updatePregunta, UpdatePreguntaState } from "@/actions/private/preguntas/update-pregunta";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { GenericCombobox } from "@/components/generic-combobox";
import { Input } from "@/components/ui/input";

import { Pregunta } from "@/schema/preguntas";
import { CategoriaPersona } from "@/schema/categoria-personas";

export function PreguntaUpdateForm({ 
  pregunta,
  categoriaPersonaList,
}: { 
  pregunta: Pregunta;
  categoriaPersonaList: CategoriaPersona[];
}) {
  const initialState: UpdatePreguntaState = {};
  const [state, dispatch] = useActionState(updatePregunta, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ pregunta.id } />
        <div>
          <p><strong>Id:</strong> { pregunta.id }</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Categoria Personas Id</Label>
          <GenericCombobox
            list={ categoriaPersonaList }
            name="categoriaPersonasId"
            valueField="id"
            defaultValue={ pregunta.categoriaPersonasId }
            searchPlaceholder="Search Categoria Personas..."
            selectPlaceholder="Select Categoria Persona..."
            emptyText="No categoriaPersona found"
            keywordFields={["id"]}
            template={(item) => <div>{item.id}</div>}
          />
          {state.errors?.categoriaPersonasId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label>Cuestionarios Id</Label>
          <Input name="cuestionariosId" defaultValue={ pregunta.cuestionariosId ?? "" } />
          {state.errors?.cuestionariosId?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Cantidad Mujeres</Label>
          <Input name="cantidadMujeres" defaultValue={ pregunta.cantidadMujeres ?? "" } />
          {state.errors?.cantidadMujeres?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Cantidad Hombres</Label>
          <Input name="cantidadHombres" defaultValue={ pregunta.cantidadHombres ?? "" } />
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
