"use client";

import { deleteModalidad, DeleteModalidadState } from "@/actions/admin/modalidads/delete-modalidad";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Modalidad } from "@/schema/modalidads";

export function ModalidadDeleteForm({ modalidad }: { modalidad: Modalidad }) {
  const initialState: DeleteModalidadState = {};
  const [state, dispatch] = useActionState(deleteModalidad, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ modalidad.id} />
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
