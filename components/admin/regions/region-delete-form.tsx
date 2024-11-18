"use client";

import { deleteRegion, DeleteRegionState } from "@/actions/admin/regions/delete-region";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Region } from "@/schema/regions";

export function RegionDeleteForm({ region }: { region: Region }) {
  const initialState: DeleteRegionState = {};
  const [state, dispatch] = useActionState(deleteRegion, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ region.id} />
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
