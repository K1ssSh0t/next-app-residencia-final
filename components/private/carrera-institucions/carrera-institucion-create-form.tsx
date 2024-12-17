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
  idInstitucion,
}: {
  carreraList: Carrera[];
  modalidadeList: Modalidad[];
  idInstitucion: string;
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
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">Los campos que son requeridos son marcados con un asterisco (*)</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="hidden">
          <Label>Instituciones Id</Label>
          <Input name="institucionesId" defaultValue={idInstitucion} />
          {state.errors?.institucionesId?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="carrerasId">Carrera *</Label>
          <GenericCombobox
            list={carreraList}
            name="carrerasId"
            valueField="id"
            searchPlaceholder="Search Carreras..."
            selectPlaceholder="Select Carrera..."
            emptyText="No carrera found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div aria-required id="carrerasId">{item.descripcion}</div>}
          />
          {state.errors?.carrerasId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label htmlFor="nombreRevoe">Nombre Revoe *</Label>
          <Input name="nombreRevoe" required id="nombreRevoe" />
          {state.errors?.nombreRevoe?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label htmlFor="planDeEstudio">Plan De Estudio *</Label>
          <Input name="planDeEstudio" required id="planDeEstudio" />
          {state.errors?.planDeEstudio?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="modalidadesId">Modalidad *</Label>
          <GenericCombobox
            list={modalidadeList}
            name="modalidadesId"
            valueField="id"
            searchPlaceholder="Search Modalidades..."
            selectPlaceholder="Select modalidad..."
            emptyText="No modalidad found"
            keywordFields={["id", "descripcion"]}
            template={(item) => <div aria-required id="modalidadesId">{item.descripcion}</div>}
          />
          {state.errors?.modalidadesId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label htmlFor="numeroRevoe">Numero Revoe *</Label>
          <Input name="numeroRevoe" required id="numeroRevoe" />
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
