"use client";

import { startTransition, useActionState } from "react";
import { createCategoriasGenerale, CreateCategoriasGeneraleState } from "@/actions/admin/categorias-generales/create-categorias-generale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function CategoriasGeneraleCreateForm() {
  const initialState: CreateCategoriasGeneraleState = {};
  const [state, dispatch] = useActionState(createCategoriasGenerale, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    console.log("formData", formData);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">El campo de Descripción es requerido.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label htmlFor="descripcion">Descripcion *</Label>
          <Input name="descripcion" required id="descripcion" />
          {state.errors?.descripcion?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="activo" name="activo" defaultChecked />
          <Label htmlFor="activo">Activo</Label>
          {state.errors?.activo?.map((error) => (
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
