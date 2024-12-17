"use client";

import { deleteEspecialidad, DeleteEspecialidadState } from "@/actions/private/especialidades/delete-especialidad";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Especialidad } from "@/schema/especialidades";

export function EspecialidadDeleteForm({ especialidad }: { especialidad: Especialidad }) {
  const initialState: DeleteEspecialidadState = {};
  const [state, dispatch] = useActionState(deleteEspecialidad, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={especialidad.id} />
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
