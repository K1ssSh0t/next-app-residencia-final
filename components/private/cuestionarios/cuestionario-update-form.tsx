"use client";

import { startTransition, useActionState } from "react";
import { updateCuestionario, UpdateCuestionarioState } from "@/actions/private/cuestionarios/update-cuestionario";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";

import { Cuestionario } from "@/schema/cuestionarios";
import { Carrera } from "@/schema/carreras";

export function CuestionarioUpdateForm({ 
  cuestionario,
  carreraList,
}: { 
  cuestionario: Cuestionario;
  carreraList: Carrera[];
}) {
  const initialState: UpdateCuestionarioState = {};
  const [state, dispatch] = useActionState(updateCuestionario, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ cuestionario.id } />
        <div>
          <p><strong>Id:</strong> { cuestionario.id }</p>
        </div>
        <div>
          <Label>Año</Label>
          <Input name="año" defaultValue={ cuestionario.año ?? "" } />
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
            defaultValue={ cuestionario.carrerasId }
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
          <Input name="usersId" defaultValue={ cuestionario.usersId ?? "" } />
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
