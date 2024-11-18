"use client";

import { startTransition, useActionState } from "react";
import { updateRegion, UpdateRegionState } from "@/actions/admin/regions/update-region";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { Region } from "@/schema/regions";

export function RegionUpdateForm({ 
  region,
}: { 
  region: Region;
}) {
  const initialState: UpdateRegionState = {};
  const [state, dispatch] = useActionState(updateRegion, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ region.id } />
        <div>
          <Label>Nombre</Label>
          <Input name="nombre" defaultValue={ region.nombre ?? "" } />
          {state.errors?.nombre?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
