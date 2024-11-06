"use client";

import { deleteCategoriaPersona, DeleteCategoriaPersonaState } from "@/actions/admin/categoria-personas/delete-categoria-persona";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { CategoriaPersona } from "@/schema/categoria-personas";

export function CategoriaPersonaDeleteForm({ categoriaPersona }: { categoriaPersona: CategoriaPersona }) {
  const initialState: DeleteCategoriaPersonaState = {};
  const [state, dispatch] = useActionState(deleteCategoriaPersona, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ categoriaPersona.id} />
        <div>
          <p><strong>Id:</strong> { categoriaPersona.id}</p>
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
