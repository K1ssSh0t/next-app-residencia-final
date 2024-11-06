"use client";

import { startTransition, useActionState } from "react";
import { updateCategoriaPersona, UpdateCategoriaPersonaState } from "@/actions/admin/categoria-personas/update-categoria-persona";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { CategoriaPersona } from "@/schema/categoria-personas";

export function CategoriaPersonaUpdateForm({ 
  categoriaPersona,
}: { 
  categoriaPersona: CategoriaPersona;
}) {
  const initialState: UpdateCategoriaPersonaState = {};
  const [state, dispatch] = useActionState(updateCategoriaPersona, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ categoriaPersona.id } />
        <div>
          <p><strong>Id:</strong> { categoriaPersona.id }</p>
        </div>
        <div>
          <Label>Descripcion</Label>
          <Input name="descripcion" defaultValue={ categoriaPersona.descripcion ?? "" } />
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
