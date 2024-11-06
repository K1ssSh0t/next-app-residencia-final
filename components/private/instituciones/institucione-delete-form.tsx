"use client";

import { deleteInstitucione, DeleteInstitucioneState } from "@/actions/private/instituciones/delete-institucione";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Institucione } from "@/schema/instituciones";

export function InstitucioneDeleteForm({ institucione }: { institucione: Institucione }) {
  const initialState: DeleteInstitucioneState = {};
  const [state, dispatch] = useActionState(deleteInstitucione, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ institucione.id} />
        <div>
          <p><strong>Id:</strong> { institucione.id}</p>
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
