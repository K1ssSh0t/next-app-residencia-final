"use client";

import { startTransition, useActionState } from "react";
import { updateCarrera, UpdateCarreraState } from "@/actions/admin/carreras/update-carrera";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { Carrera } from "@/schema/carreras";

export function CarreraUpdateForm({
  carrera,
}: {
  carrera: Carrera;
}) {
  const initialState: UpdateCarreraState = {};
  const [state, dispatch] = useActionState(updateCarrera, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">Los campos de clave y descripción son requeridos.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={carrera.id} />
        <div>
          <p><strong>Id:</strong> {carrera.id}</p>
        </div>
        <div>
          <Label htmlFor="clave">Clave *</Label>
          <Input name="clave" defaultValue={carrera.clave ?? ""} required id="clave" />
          {state.errors?.clave?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label htmlFor="descripcion">Descripcion *</Label>
          <Input name="descripcion" defaultValue={carrera.descripcion ?? ""} required id="descripcion" />
          {state.errors?.descripcion?.map((error) => (
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
