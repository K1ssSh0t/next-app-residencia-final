"use client";

import { deleteCategoriasGenerale, DeleteCategoriasGeneraleState } from "@/actions/admin/categorias-generales/delete-categorias-generale";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { CategoriasGenerale } from "@/schema/categorias-generales";

export function CategoriasGeneraleDeleteForm({ categoriasGenerale }: { categoriasGenerale: CategoriasGenerale }) {
  const initialState: DeleteCategoriasGeneraleState = {};
  const [state, dispatch] = useActionState(deleteCategoriasGenerale, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ categoriasGenerale.id} />
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
