"use client";

import { startTransition, useActionState } from "react";
import { updateCarreraInstitucion, UpdateCarreraInstitucionState } from "@/actions/private/carrera-institucions/update-carrera-institucion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";

import { CarreraInstitucion } from "@/schema/carrera-institucions";
import { Carrera } from "@/schema/carreras";
import { Modalidad } from "@/schema/modalidads";

export function CarreraInstitucionUpdateForm({
  carreraInstitucion,
  carreraList,
  modalidadeList,
}: {
  carreraInstitucion: CarreraInstitucion;
  carreraList: Carrera[];
  modalidadeList: Modalidad[];
}) {
  const initialState: UpdateCarreraInstitucionState = {};
  const [state, dispatch] = useActionState(updateCarreraInstitucion, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={carreraInstitucion.id} />
        <div className="hidden">
          <Label>Instituciones Id</Label>
          <Input name="institucionesId" defaultValue={carreraInstitucion.institucionesId ?? ""} />
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
            defaultValue={carreraInstitucion.carrerasId}
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
          <Input name="nombreRevoe" defaultValue={carreraInstitucion.nombreRevoe ?? ""} />
          {state.errors?.nombreRevoe?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Plan De Estudio</Label>
          <Input name="planDeEstudio" defaultValue={carreraInstitucion.planDeEstudio ?? ""} />
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
            defaultValue={carreraInstitucion.modalidadesId}
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
          <Input name="numeroRevoe" defaultValue={carreraInstitucion.numeroRevoe ?? ""} />
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
