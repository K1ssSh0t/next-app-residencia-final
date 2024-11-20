"use client";

import { startTransition, useActionState } from "react";
import { createCarreraInstitucion, CreateCarreraInstitucionState } from "@/actions/private/carrera-institucions/create-carrera-institucion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";

import { Carrera } from "@/schema/carreras";
import { Modalidad } from "@/schema/modalidads";

export function CarreraInstitucionCreateForm({
  carreraList,
  modalidadeList,
}: {
  carreraList: Carrera[];
  modalidadeList: Modalidad[];
}) {
  const initialState: CreateCarreraInstitucionState = {};
  const [state, dispatch] = useActionState(createCarreraInstitucion, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Instituciones Id</Label>
          <Input name="institucionesId" />
          {state.errors?.institucionesId?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Carreras Id</Label>
          <GenericCombobox
            list={carreraList}
            name="carrerasId"
            valueField="id"
            searchPlaceholder="Search Carreras..."
            selectPlaceholder="Select Carrera..."
            emptyText="No carrera found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div>{item.descripcion}</div>}
          />
          {state.errors?.carrerasId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label>Nombre Revoe</Label>
          <Input name="nombreRevoe" />
          {state.errors?.nombreRevoe?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Plan De Estudio</Label>
          <Input name="planDeEstudio" />
          {state.errors?.planDeEstudio?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Modalidades Id</Label>
          <GenericCombobox
            list={modalidadeList}
            name="modalidadesId"
            valueField="id"
            searchPlaceholder="Search Modalidades..."
            selectPlaceholder="Select Modalidade..."
            emptyText="No modalidade found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div>{item.descripcion}</div>}
          />
          {state.errors?.modalidadesId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label>Numero Revoe</Label>
          <Input name="numeroRevoe" />
          {state.errors?.numeroRevoe?.map((error) => (
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
