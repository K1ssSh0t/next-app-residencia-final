"use client";

import { startTransition, useActionState } from "react";
import { createCuestionario, CreateCuestionarioState } from "@/actions/private/cuestionarios/create-cuestionario";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";

import { Carrera } from "@/schema/carreras";

export function CuestionarioCreateForm({
  carreraList,
}: {
  carreraList: Carrera[];
}) {
  const initialState: CreateCuestionarioState = {};
  const [state, dispatch] = useActionState(createCuestionario, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Año</Label>
          <Input name="año" />
          {state.errors?.año?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Carreras Id</Label>
          <GenericCombobox
            list={ carreraList }
            name="carrerasId"
            valueField="id"
            searchPlaceholder="Search Carreras..."
            selectPlaceholder="Select Carrera..."
            emptyText="No carrera found"
            keywordFields={["id"]}
            template={(item) => <div>{item.id}</div>}
          />
          {state.errors?.carrerasId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label>Users Id</Label>
          <Input name="usersId" />
          {state.errors?.usersId?.map((error) => (
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
