"use client";

import { startTransition, useActionState } from "react";
import { createEspecialidad, CreateEspecialidadState } from "@/actions/private/especialidades/create-especialidad";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";


export function EspecialidadCreateForm() {
  const initialState: CreateEspecialidadState = {};
  const [state, dispatch] = useActionState(createEspecialidad, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-row  gap-2">
        <div>
          <Label>Nombre</Label>
          <Input name="nombre" />
          {state.errors?.nombre?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Hombres</Label>
          <Input name="hombres" />
          {state.errors?.hombres?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Mujeres</Label>
          <Input name="mujeres" />
          {state.errors?.mujeres?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Cuestionario Id</Label>
          <Input name="cuestionarioId" />
          {state.errors?.cuestionarioId?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className=" flex items-end ">
          <Button type="submit">Submit</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
