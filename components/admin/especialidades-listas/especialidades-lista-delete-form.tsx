"use client";

import { deleteEspecialidadesLista, DeleteEspecialidadesListaState } from "@/actions/admin/especialidades-listas/delete-especialidades-lista";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { EspecialidadesLista } from "@/schema/especialidades-listas";

export function EspecialidadesListaDeleteForm({ especialidadesLista }: { especialidadesLista: EspecialidadesLista }) {
  const initialState: DeleteEspecialidadesListaState = {};
  const [state, dispatch] = useActionState(deleteEspecialidadesLista, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ especialidadesLista.id} />
        <div>
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
