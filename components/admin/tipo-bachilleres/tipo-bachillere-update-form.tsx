"use client";

import { startTransition, useActionState } from "react";
import { updateTipoBachillere, UpdateTipoBachillereState } from "@/actions/admin/tipo-bachilleres/update-tipo-bachillere";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { TipoBachilleres } from "@/schema/tipo-bachilleres";
import Swal from "sweetalert2";

export function TipoBachillereUpdateForm({
  tipoBachillere,
}: {
  tipoBachillere: TipoBachilleres;
}) {
  const initialState: UpdateTipoBachillereState = {};
  const [state, dispatch] = useActionState(updateTipoBachillere, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se actualizará la información del Tipo Bachiller actual. Esto afectara a cuestionarios anteriores",
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
          text: "El Tipo Bachiller se ha actualizado correctamente.",
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
        <p className="text-yellow-700">El campo de descripción es requerido.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={tipoBachillere.id} />
        <div>
          <p><strong>Id:</strong> {tipoBachillere.id}</p>
        </div>
        <div>
          <Label htmlFor="descripcion">Descripción *</Label>
          <Input name="descripcion" defaultValue={tipoBachillere.descripcion ?? ""} required id="descripcion" />
          {state.errors?.descripcion?.map((error) => (
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
