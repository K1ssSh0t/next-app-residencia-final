"use client";

import { startTransition, useActionState } from "react";
import { updateCategoriaPersona, UpdateCategoriaPersonaState } from "@/actions/admin/categoria-personas/update-categoria-persona";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoriaPersona } from "@/schema/categoria-personas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Swal from "sweetalert2";

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

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se actualizará la información del indicador actual.  Esto afectara a cuestionarios anteriores",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#631233",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(() => dispatch(formData));
        Swal.fire({
          title: "Actualizado",
          text: "El indicador se ha actualizado correctamente.",
          icon: "success",
          confirmButtonColor: "#631233",
          timer: 2000, 
          timerProgressBar: true
        });
      }
    });
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">Los campos de descripción y nivel aplicable son requeridos.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={categoriaPersona.id} />
        {/*Label Oculto*/}
        {/*<div>
          <p><strong>Id:</strong> {categoriaPersona.id}</p>
        </div>*/}
        <div>
          <Label htmlFor="descripcion">Descripción</Label>
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
        <div className="flex items-center space-x-2 p-4 border rounded-md shadow">
          <Checkbox id="activo" name="activo" defaultChecked={categoriaPersona.activo ?? false} />
          <Label htmlFor="activo">Activo</Label>
          {state.errors?.activo?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Button type="submit">Enviart</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
