"use client";

import { startTransition, useActionState } from "react";
import { createTipoBachillere, CreateTipoBachillereState } from "@/actions/admin/tipo-bachilleres/create-tipo-bachillere";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";


export function TipoBachillereCreateForm() {
  const initialState: CreateTipoBachillereState = {};
  const [state, dispatch] = useActionState(createTipoBachillere, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Descripcion</Label>
          <Input name="descripcion" />
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