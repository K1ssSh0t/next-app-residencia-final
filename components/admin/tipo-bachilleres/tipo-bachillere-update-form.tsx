"use client";

import { startTransition, useActionState } from "react";
import { updateTipoBachillere, UpdateTipoBachillereState } from "@/actions/admin/tipo-bachilleres/update-tipo-bachillere";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { TipoBachillere } from "@/schema/tipo-bachilleres";

export function TipoBachillereUpdateForm({ 
  tipoBachillere,
}: { 
  tipoBachillere: TipoBachillere;
}) {
  const initialState: UpdateTipoBachillereState = {};
  const [state, dispatch] = useActionState(updateTipoBachillere, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ tipoBachillere.id } />
        <div>
          <p><strong>Id:</strong> { tipoBachillere.id }</p>
        </div>
        <div>
          <Label>Descripcion</Label>
          <Input name="descripcion" defaultValue={ tipoBachillere.descripcion ?? "" } />
          {state.errors?.descripcion?.map((error) => (
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
