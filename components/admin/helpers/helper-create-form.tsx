"use client";

import { startTransition, useActionState } from "react";
import { createHelper, CreateHelperState } from "@/actions/admin/helpers/create-helper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Checkbox } from "@/components/ui/checkbox";


export function HelperCreateForm() {
  const initialState: CreateHelperState = {};
  const [state, dispatch] = useActionState(createHelper, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label className="mr-2">Estado Cuestionario</Label>
          <Checkbox name="estadoCuestionario" />
          {state.errors?.estadoCuestionario?.map((error) => (
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
