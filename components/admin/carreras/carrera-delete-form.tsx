"use client";

import { deleteCarrera, DeleteCarreraState } from "@/actions/admin/carreras/delete-carrera";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Carrera } from "@/schema/carreras";

export function CarreraDeleteForm({ carrera }: { carrera: Carrera }) {
  const initialState: DeleteCarreraState = {};
  const [state, dispatch] = useActionState(deleteCarrera, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ carrera.id} />
        <div>
          <p><strong>Id:</strong> { carrera.id}</p>
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
