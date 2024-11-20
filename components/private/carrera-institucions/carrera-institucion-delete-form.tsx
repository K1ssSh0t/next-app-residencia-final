"use client";

import { deleteCarreraInstitucion, DeleteCarreraInstitucionState } from "@/actions/private/carrera-institucions/delete-carrera-institucion";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { CarreraInstitucion } from "@/schema/carrera-institucions";

export function CarreraInstitucionDeleteForm({ carreraInstitucion }: { carreraInstitucion: CarreraInstitucion }) {
  const initialState: DeleteCarreraInstitucionState = {};
  const [state, dispatch] = useActionState(deleteCarreraInstitucion, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ carreraInstitucion.id} />
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
