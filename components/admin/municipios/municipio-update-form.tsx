"use client";

import { startTransition, useActionState } from "react";
import { updateMunicipio, UpdateMunicipioState } from "@/actions/admin/municipios/update-municipio";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";

import { Municipio } from "@/schema/municipios";
import { Region } from "@/schema/regions";
import Swal from "sweetalert2";

export function MunicipioUpdateForm({
  municipio,
  regionList,
}: {
  municipio: Municipio;
  regionList: Region[];
}) {
  const initialState: UpdateMunicipioState = {};
  const [state, dispatch] = useActionState(updateMunicipio, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se actualizará el Municipio actual. Esto afectara a los registros anteriores",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#631233",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(() => dispatch(formData));
        Swal.fire({
          title: "Actualizado",
          text: "El municipio se ha actualizado correctamente.",
          icon: "success",
          confirmButtonColor: "#631233",
          timer: 2000, 
          timerProgressBar: true
        });
      }
    });
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">Los campos de Nombre y Region son requeridos.</p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={municipio.id} />
        <div>
          <Label htmlFor="nombre">Nombre *</Label>
          <Input name="nombre" defaultValue={municipio.nombre ?? ""} required id="nombre" />
          {state.errors?.nombre?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="regionId" >Region *</Label>
          <GenericCombobox
            list={regionList}
            name="regionId"
            valueField="id"
            defaultValue={municipio.regionId}
            searchPlaceholder="Buscar Region..."
            selectPlaceholder="Seleccionar Region..."
            emptyText="No se encontró ninguna región"
            keywordFields={["id", "nombre"]}
            template={(item) => <div aria-required="true" id="regionId">{item.nombre}</div>}
          />
          {state.errors?.regionId?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Button type="submit">Enviar</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
