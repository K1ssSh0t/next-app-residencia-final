"use client";

import { startTransition, useActionState } from "react";
import { createCategoriaPersona, CreateCategoriaPersonaState } from "@/actions/admin/categoria-personas/create-categoria-persona";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Swal from "sweetalert2";

export function CategoriaPersonaCreateForm() {
  const initialState: CreateCategoriaPersonaState = {};
  const [state, dispatch] = useActionState(createCategoriaPersona, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
    Swal.fire({
      title: "Guardado",
      text: "Se han guardado los datos.",
      icon: "success",
      confirmButtonColor: "#631233",
      timer: 2000, 
      timerProgressBar: true
      
    });
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">Los campos de descripción y nivel aplicable son requeridos.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label htmlFor="descripcion">Descripción *</Label>
          <Input name="descripcion" required id="descripcion" />
          {state.errors?.descripcion?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label htmlFor="nivelAplicado">Nivel aplicable *</Label>
          <Select name="nivelAplicado">
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
        <div className="flex items-center space-x-2 p-4 border rounded-md shadow">
          <Checkbox id="activo" name="activo" defaultChecked />
          <Label htmlFor="activo">Activo</Label>
          {state.errors?.activo?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Button type="submit">Enviar</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
