"use client";

import { startTransition, useActionState } from "react";
import { updateTipoInstitucione, UpdateTipoInstitucioneState } from "@/actions/admin/tipo-instituciones/update-tipo-institucione";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { TipoInstitucione } from "@/schema/tipo-instituciones";

export function TipoInstitucioneUpdateForm({ 
  tipoInstitucione,
}: { 
  tipoInstitucione: TipoInstitucione;
}) {
  const initialState: UpdateTipoInstitucioneState = {};
  const [state, dispatch] = useActionState(updateTipoInstitucione, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ tipoInstitucione.id } />
        <div>
          <p><strong>Id:</strong> { tipoInstitucione.id }</p>
        </div>
        <div>
          <Label>Descripcion</Label>
          <Input name="descripcion" defaultValue={ tipoInstitucione.descripcion ?? "" } />
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
