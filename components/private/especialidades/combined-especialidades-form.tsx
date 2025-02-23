"use client";

import { startTransition, useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GenericCombobox } from "@/components/generic-combobox";
import { FormAlert } from "@/components/form-alert";
import { Especialidad } from "@/schema/especialidades";
import { EspecialidadesLista } from "@/schema/especialidades-listas";
import {
  updateEspecialidadesMultiples,
  UpdateEspecialidadState,
} from "@/actions/private/especialidades/update-especialidades-multiples";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export function CombinedEspecialidadesForm({
  existingEspecialidades,
  listaEspecialidades,
  cuestionarioId,
  numeroCarreras,
}: {
  existingEspecialidades: Especialidad[];
  listaEspecialidades: EspecialidadesLista[];
  cuestionarioId: string;
  numeroCarreras: number;
}) {
  const initialState: UpdateEspecialidadState = {};
  // const [state, dispatch] = useActionState(updateEspecialidadesMultiples, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  function validateForm(formData: FormData): boolean {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    const selectedEspecialidadIds: string[] = [];

    // Helper function to check for duplicates
    const checkDuplicate = (id: string, fieldName: string): boolean => {
      if (selectedEspecialidadIds.includes(id)) {
        errors[fieldName] = "Especialidad ya seleccionada";
        return true;
      }
      selectedEspecialidadIds.push(id);
      return false;
    };

    // Validate existing especialidades
    existingEspecialidades.forEach((especialidad, index) => {
      const nombreEsp = formData.get(`nombreEspecialidad-${index}`) as string;
      const hombres = formData.get(`hombres-${index}`);
      const mujeres = formData.get(`mujeres-${index}`);

      if (!nombreEsp) {
        errors[`nombreEspecialidad-${index}`] = "El nombre es requerido";
        isValid = false;
      } else if (checkDuplicate(nombreEsp, `nombreEspecialidad-${index}`)) {
        isValid = false;
      }

      if (!hombres || isNaN(Number(hombres))) {
        errors[`hombres-${index}`] = "Cantidad válida requerida";
        isValid = false;
      }
      if (!mujeres || isNaN(Number(mujeres))) {
        errors[`mujeres-${index}`] = "Cantidad válida requerida";
        isValid = false;
      }
    });

    // Validate new especialidades
    const remainingSlots = numeroCarreras - existingEspecialidades.length;
    let newEntriesCount = 0;

    for (let i = 0; i < remainingSlots; i++) {
      const nombreEsp = formData.get(`new-nombreEspecialidad-${i}`) as string;
      const hombres = formData.get(`new-hombres-${i}`);
      const mujeres = formData.get(`new-mujeres-${i}`);

      if (nombreEsp || hombres || mujeres) {
        newEntriesCount++;
        if (!nombreEsp) {
          errors[`new-nombreEspecialidad-${i}`] = "El nombre es requerido";
          isValid = false;
        } else if (checkDuplicate(nombreEsp, `new-nombreEspecialidad-${i}`)) {
          isValid = false;
        }

        if (!hombres || isNaN(Number(hombres))) {
          errors[`new-hombres-${i}`] = "Cantidad válida requerida";
          isValid = false;
        }
        if (!mujeres || isNaN(Number(mujeres))) {
          errors[`new-mujeres-${i}`] = "Cantidad válida requerida";
          isValid = false;
        }
      }
    }

    // Verify all slots are filled
    if (newEntriesCount + existingEspecialidades.length < numeroCarreras) {
      toast({
        title: "Error",
        description: `Debe completar todas las ${numeroCarreras} especialidades`,
        variant: "destructive",
      });
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    if (!validateForm(formData)) {
      return;
    }

    try {
      // const result = startTransition(() => dispatch(formData));

      const resultado = await updateEspecialidadesMultiples({}, formData);

      if (resultado.message) {
        Swal.fire({
          title: "Guardado",
          text: "Se han guardado los datos.",
          icon: "success",
          confirmButtonColor: "#631233",
          timer: 2000,
          timerProgressBar: true,
        });
        router.refresh();
      } else if (resultado?.status === "error") {
        toast({
          title: "Error",
          description: resultado.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar los cambios",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Existing Especialidades */}
      {existingEspecialidades.map((especialidad, index) => (
        <div
          key={`existing-${index}`}
          className="flex flex-row gap-4 items-end"
        >
          <input type="hidden" name={`id-${index}`} value={especialidad.id} />
          <div className="flex flex-col gap-2 w-[500px]">
            <Label>Nombre</Label>
            <GenericCombobox
              list={listaEspecialidades}
              name={`nombreEspecialidad-${index}`}
              valueField="id"
              defaultValue={especialidad.nombreEspecialidad ?? ""}
              searchPlaceholder="Buscar Especialidad..."
              selectPlaceholder="Seleccionar Especialidad..."
              emptyText="No se encontró la especialidad"
              keywordFields={["id", "descripcion"]}
              template={(item) => <div>{item.descripcion}</div>}
            />
            {formErrors[`nombreEspecialidad-${index}`] && (
              <p className="text-sm text-red-500">
                {formErrors[`nombreEspecialidad-${index}`]}
              </p>
            )}
          </div>
          <div className="w-[150px]">
            <Label>Hombres</Label>
            <Input
              name={`hombres-${index}`}
              defaultValue={especialidad.hombres ?? ""}
              type="number"
              min="0"
            />
            {formErrors[`hombres-${index}`] && (
              <p className="text-sm text-red-500">
                {formErrors[`hombres-${index}`]}
              </p>
            )}
          </div>
          <div className="w-[150px]">
            <Label>Mujeres</Label>
            <Input
              name={`mujeres-${index}`}
              defaultValue={especialidad.mujeres ?? ""}
              type="number"
              min="0"
            />
            {formErrors[`mujeres-${index}`] && (
              <p className="text-sm text-red-500">
                {formErrors[`mujeres-${index}`]}
              </p>
            )}
          </div>
          <input
            type="hidden"
            name={`cuestionarioId-${index}`}
            value={especialidad.cuestionarioId ?? ""}
          />
        </div>
      ))}

      {/* New Especialidades */}
      {Array.from({
        length: numeroCarreras - existingEspecialidades.length,
      }).map((_, index) => (
        <div key={`new-${index}`} className="flex flex-row gap-4 items-end">
          <div className="flex flex-col gap-2 w-[500px]">
            <Label>Nombre</Label>
            <GenericCombobox
              list={listaEspecialidades}
              name={`new-nombreEspecialidad-${index}`}
              valueField="id"
              searchPlaceholder="Buscar Especialidad..."
              selectPlaceholder="Seleccionar Especialidad..."
              emptyText="No se encontró la especialidad"
              keywordFields={["id", "descripcion"]}
              template={(item) => <div>{item.descripcion}</div>}
            />
            {formErrors[`new-nombreEspecialidad-${index}`] && (
              <p className="text-sm text-red-500">
                {formErrors[`new-nombreEspecialidad-${index}`]}
              </p>
            )}
          </div>
          <div className="w-[150px]">
            <Label>Hombres</Label>
            <Input
              name={`new-hombres-${index}`}
              type="number"
              min="0"
              required
            />
            {formErrors[`new-hombres-${index}`] && (
              <p className="text-sm text-red-500">
                {formErrors[`new-hombres-${index}`]}
              </p>
            )}
          </div>
          <div className="w-[150px]">
            <Label>Mujeres</Label>
            <Input
              name={`new-mujeres-${index}`}
              type="number"
              min="0"
              required
            />
            {formErrors[`new-mujeres-${index}`] && (
              <p className="text-sm text-red-500">
                {formErrors[`new-mujeres-${index}`]}
              </p>
            )}
          </div>
          <input
            type="hidden"
            name={`new-cuestionarioId-${index}`}
            value={cuestionarioId}
          />
        </div>
      ))}

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Especialidades: {existingEspecialidades.length} de {numeroCarreras}
        </p>
        <Button type="submit">Guardar Todos los Cambios</Button>
      </div>
      {/* <FormAlert state={resultado} /> */}
    </form>
  );
}
