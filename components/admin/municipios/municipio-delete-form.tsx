"use client";

import { deleteMunicipio, DeleteMunicipioState } from "@/actions/admin/municipios/delete-municipio";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Municipio } from "@/schema/municipios";

export function MunicipioDeleteForm({ municipio }: { municipio: Municipio }) {
  const initialState: DeleteMunicipioState = {};
  const [state, dispatch] = useActionState(deleteMunicipio, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ municipio.id} />
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
