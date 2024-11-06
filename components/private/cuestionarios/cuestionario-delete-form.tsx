"use client";

import { deleteCuestionario, DeleteCuestionarioState } from "@/actions/private/cuestionarios/delete-cuestionario";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Cuestionario } from "@/schema/cuestionarios";

export function CuestionarioDeleteForm({ cuestionario }: { cuestionario: Cuestionario }) {
  const initialState: DeleteCuestionarioState = {};
  const [state, dispatch] = useActionState(deleteCuestionario, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ cuestionario.id} />
        <div>
          <p><strong>Id:</strong> { cuestionario.id}</p>
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
