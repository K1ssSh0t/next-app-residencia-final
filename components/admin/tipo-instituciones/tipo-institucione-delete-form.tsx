"use client";

import { deleteTipoInstitucione, DeleteTipoInstitucioneState } from "@/actions/admin/tipo-instituciones/delete-tipo-institucione";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { TipoInstituciones } from "@/schema/tipo-instituciones";

export function TipoInstitucioneDeleteForm({ tipoInstitucione }: { tipoInstitucione: TipoInstituciones }) {
  const initialState: DeleteTipoInstitucioneState = {};
  const [state, dispatch] = useActionState(deleteTipoInstitucione, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={tipoInstitucione.id} />
        <div>
          <p><strong>Id:</strong> {tipoInstitucione.id}</p>
        </div>
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
