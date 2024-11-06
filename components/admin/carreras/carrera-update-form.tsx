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
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ carrera.id } />
        <div>
          <p><strong>Id:</strong> { carrera.id }</p>
        </div>
        <div>
          <Label>Descripcion</Label>
          <Input name="descripcion" defaultValue={ carrera.descripcion ?? "" } />
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
