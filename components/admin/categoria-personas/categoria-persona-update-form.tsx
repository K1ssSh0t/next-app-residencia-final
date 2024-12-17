"use client";

import { startTransition, useActionState } from "react";
import { updateCategoriaPersona, UpdateCategoriaPersonaState } from "@/actions/admin/categoria-personas/update-categoria-persona";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { CategoriaPersona } from "@/schema/categoria-personas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">Los campos de descripción y nivel aplicable son requeridos.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={categoriaPersona.id} />
        <div>
          <p><strong>Id:</strong> {categoriaPersona.id}</p>
        </div>
        <div>
          <Label htmlFor="descripcion">Descripcion</Label>
          <Input name="descripcion" defaultValue={categoriaPersona.descripcion ?? ""} id="descripcion" required />
          {state.errors?.descripcion?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label htmlFor="nivelAplicado">Nivel Aplicable</Label>
          <Select name="nivelAplicado" defaultValue={categoriaPersona.nivelAplicado ?? ""} required >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el nivel aplicable" id="nivelAplicado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="superior">Superior</SelectItem>
              <SelectItem value="medioSuperior">Medio Superior</SelectItem>
              <SelectItem value="ambos">Ambos</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.nivelAplicado?.map((error) => (
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
