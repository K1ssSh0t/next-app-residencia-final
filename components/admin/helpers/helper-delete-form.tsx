"use client";

import { deleteHelper, DeleteHelperState } from "@/actions/admin/helpers/delete-helper";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Helper } from "@/schema/helpers";

export function HelperDeleteForm({ helper }: { helper: Helper }) {
  const initialState: DeleteHelperState = {};
  const [state, dispatch] = useActionState(deleteHelper, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ helper.id} />
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
