"use client";

import { deleteTipoBachillere, DeleteTipoBachillereState } from "@/actions/admin/tipo-bachilleres/delete-tipo-bachillere";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { TipoBachilleres } from "@/schema/tipo-bachilleres";

export function TipoBachillereDeleteForm({ tipoBachillere }: { tipoBachillere: TipoBachilleres }) {
  const initialState: DeleteTipoBachillereState = {};
  const [state, dispatch] = useActionState(deleteTipoBachillere, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ tipoBachillere.id} />
        <div>
          <p><strong>Id:</strong> { tipoBachillere.id}</p>
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
