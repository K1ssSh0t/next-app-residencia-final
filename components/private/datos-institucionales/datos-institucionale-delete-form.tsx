"use client";

import { deleteDatosInstitucionale, DeleteDatosInstitucionaleState } from "@/actions/private/datos-institucionales/delete-datos-institucionale";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { DatosInstitucionale } from "@/schema/datos-institucionales";

export function DatosInstitucionaleDeleteForm({ datosInstitucionale }: { datosInstitucionale: DatosInstitucionale }) {
  const initialState: DeleteDatosInstitucionaleState = {};
  const [state, dispatch] = useActionState(deleteDatosInstitucionale, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ datosInstitucionale.id} />
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
