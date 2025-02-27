"use client";

import { startTransition, useActionState } from "react";
import { createEspecialidadesLista, CreateEspecialidadesListaState } from "@/actions/admin/especialidades-listas/create-especialidades-lista";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export function EspecialidadesListaCreateForm() {
  const initialState: CreateEspecialidadesListaState = {};
  const [state, dispatch] = useActionState(createEspecialidadesLista, initialState);

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
      <div className="mb-2 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">Los campos de clave y descripción son requeridos.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
        <Label htmlFor="clave">Clave *</Label>
        <Input name="clave" required id="clave" />
          {state.errors?.clave?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
        <Label htmlFor="descripcion">Descripcion *</Label>
        <Input name="descripcion" required id="descripcion" />
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
