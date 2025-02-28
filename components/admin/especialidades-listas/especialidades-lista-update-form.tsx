"use client";

import { startTransition, useActionState } from "react";
import { updateEspecialidadesLista, UpdateEspecialidadesListaState } from "@/actions/admin/especialidades-listas/update-especialidades-lista";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { EspecialidadesLista } from "@/schema/especialidades-listas";
import Swal from "sweetalert2";

export function EspecialidadesListaUpdateForm({ 
  especialidadesLista,
}: { 
  especialidadesLista: EspecialidadesLista;
}) {
  const initialState: UpdateEspecialidadesListaState = {};
  const [state, dispatch] = useActionState(updateEspecialidadesLista, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se actualizará la Especialidad actual. Esto afectara a los registros anteriores",
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
          text: "La Especialidad se ha actualizado correctamente.",
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
        <p className="text-yellow-700">Los campos de clave y descripción son requeridos.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ especialidadesLista.id } />
        <div>
          <Label>Clave</Label>
          <Input name="clave" defaultValue={ especialidadesLista.clave ?? "" } />
          {state.errors?.clave?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Descripción</Label>
          <Input name="descripcion" defaultValue={ especialidadesLista.descripcion ?? "" } />
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
