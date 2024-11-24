"use client";

import { startTransition, useActionState } from "react";
import { updateCategoriasGenerale, UpdateCategoriasGeneraleState } from "@/actions/admin/categorias-generales/update-categorias-generale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { CategoriasGenerale } from "@/schema/categorias-generales";

export function CategoriasGeneraleUpdateForm({ 
  categoriasGenerale,
}: { 
  categoriasGenerale: CategoriasGenerale;
}) {
  const initialState: UpdateCategoriasGeneraleState = {};
  const [state, dispatch] = useActionState(updateCategoriasGenerale, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ categoriasGenerale.id } />
        <div>
          <Label>Descripcion</Label>
          <Input name="descripcion" defaultValue={ categoriasGenerale.descripcion ?? "" } />
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
