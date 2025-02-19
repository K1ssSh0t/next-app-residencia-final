"use client";

import { startTransition, useActionState } from "react";
import { updateCategoriasGenerale, UpdateCategoriasGeneraleState } from "@/actions/admin/categorias-generales/update-categorias-generale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoriasGenerales } from "@/schema/categorias-generales";
import Swal from "sweetalert2";

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

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se actualizará la Categoría General seleccionada. Esto afectara al estado en el cuestionario",
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
          text: "La Categoría General se ha actualizado correctamente.",
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
        <p className="text-yellow-700">El campo de Descripción es requerido.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={categoriasGenerales.id} />
        <div>
          <Label htmlFor="descripcion">Descripción *</Label>
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
          <Button type="submit">Enviar</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
