"use client";

import { startTransition, useActionState } from "react";
import { updateRegion, UpdateRegionState } from "@/actions/admin/regions/update-region";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { Region } from "@/schema/regions";
import Swal from "sweetalert2";

export function RegionUpdateForm({
  region,
}: {
  region: Region;
}) {
  const initialState: UpdateRegionState = {};
  const [state, dispatch] = useActionState(updateRegion, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se actualizará la Region actual. Esto afectara a los registros anteriores",
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
          text: "La Region se ha actualizado correctamente.",
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
        <p className="text-yellow-700">El campo de Nombre es requerido.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={region.id} />
        <div>
          <Label htmlFor="nombre">Nombre *</Label>
          <Input name="nombre" defaultValue={region.nombre ?? ""} required id="nombre" />
          {state.errors?.nombre?.map((error) => (
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
