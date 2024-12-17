"use client";

import { startTransition, useActionState } from "react";
import { updateModalidad, UpdateModalidadState } from "@/actions/admin/modalidads/update-modalidad";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { Modalidad } from "@/schema/modalidads";

export function ModalidadUpdateForm({
  modalidad,
}: {
  modalidad: Modalidad;
}) {
  const initialState: UpdateModalidadState = {};
  const [state, dispatch] = useActionState(updateModalidad, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">El campo de descripción es requerido.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={modalidad.id} />
        <div>
          <Label htmlFor="descripcion">Descripcion *</Label>
          <Input name="descripcion" defaultValue={modalidad.descripcion ?? ""} required id="descripcion"
          />
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
