"use client";

import { startTransition, useActionState } from "react";
import { updateCategoriasGenerale, UpdateCategoriasGeneraleState } from "@/actions/admin/categorias-generales/update-categorias-generale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoriasGenerales } from "@/schema/categorias-generales";

export function CategoriasGeneraleUpdateForm({
  categoriasGenerales,
}: {
  categoriasGenerales: CategoriasGenerales;
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
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">El campo de Descripción es requerido.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={categoriasGenerales.id} />
        <div>
          <Label htmlFor="descripcion">Descripcion *</Label>
          <Input name="descripcion" defaultValue={categoriasGenerales.descripcion ?? ""} required id="descripcion" />
          {state.errors?.descripcion?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex items-center space-x-2 p-4 border rounded-md shadow">
          <Checkbox id="activo" name="activo" defaultChecked={categoriasGenerales.activo ?? false} />
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
