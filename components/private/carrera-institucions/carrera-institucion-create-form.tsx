"use client";

import { startTransition, useActionState } from "react";
import { createCarreraInstitucion, CreateCarreraInstitucionState } from "@/actions/private/carrera-institucions/create-carrera-institucion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";
import { AsyncSearchCombobox } from "@/components/async-search-combobox";

import { Modalidad } from "@/schema/modalidads";

export function CarreraInstitucionCreateForm({
  modalidadeList,
  idInstitucion,
}: {
  modalidadeList: Modalidad[];
  idInstitucion: string;
}) {
  const initialState: CreateCarreraInstitucionState = {};
  const [state, dispatch] = useActionState(createCarreraInstitucion, initialState);

  async function searchCarreras(query: string) {
    const response = await fetch(`/api/carreras/search?q=${query}`);
    return response.json();
  }

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
          <AsyncSearchCombobox
            onSearch={searchCarreras}
            name="carrerasId"
            valueField="id"
            searchPlaceholder="Buscar carreras..."
            selectPlaceholder="Seleccionar carrera..."
            emptyText="No se encontraron carreras"
            minSearchLength={3}
            keywordFields={["id", "descripcion"]}
            template={(item) => <div>{item.descripcion}</div>}
          />
          {state.errors?.carrerasId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        {/* <div>
          <Label htmlFor="nombreRevoe">Nombre Revoe *</Label>
          <Input name="nombreRevoe" required id="nombreRevoe" />
          {state.errors?.nombreRevoe?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div> */}
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
            searchPlaceholder="Buscar Modalidades..."
            selectPlaceholder="Seleccionar modalidad..."
            emptyText="No se encontró modalidad"
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
