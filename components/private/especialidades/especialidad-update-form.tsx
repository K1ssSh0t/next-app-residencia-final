"use client";

import { startTransition, useActionState } from "react";
import { updateEspecialidad, UpdateEspecialidadState } from "@/actions/private/especialidades/update-especialidad";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { Especialidad } from "@/schema/especialidades";

export function EspecialidadUpdateForm({
  especialidad,
}: {
  especialidad: Especialidad;
}) {
  const initialState: UpdateEspecialidadState = {};
  const [state, dispatch] = useActionState(updateEspecialidad, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-row gap-2">
        <input type="hidden" name="id" value={especialidad.id} />
        <div>
          <Label>Nombre</Label>
          <Input name="nombre" defaultValue={especialidad.nombre ?? ""} />
          {state.errors?.nombre?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Hombres</Label>
          <Input name="hombres" defaultValue={especialidad.hombres ?? ""} />
          {state.errors?.hombres?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Mujeres</Label>
          <Input name="mujeres" defaultValue={especialidad.mujeres ?? ""} />
          {state.errors?.mujeres?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="hidden">
          <Label>Cuestionario Id</Label>
          <Input name="cuestionarioId" defaultValue={especialidad.cuestionarioId ?? ""} />
          {state.errors?.cuestionarioId?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className=" flex items-end ">
          <Button type="submit">Actualizar</Button>
        </div >
        <FormAlert state={state} />
      </form>
    </div>
  );
}
