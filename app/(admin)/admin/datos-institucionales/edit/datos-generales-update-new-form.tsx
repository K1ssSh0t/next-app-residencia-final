"use client";

import { startTransition, useActionState } from "react";
import { updateDatosInstitucionale, UpdateDatosInstitucionaleState } from "@/actions/private/datos-institucionales/update-datos-institucionale";
import { createDatosInstitucionale } from "@/actions/private/datos-institucionales/create-datos-institucionale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { CategoriasGenerale } from "@/schema/categorias-generales";
import { DatosInstitucionale } from "@/schema/datos-institucionales";

export function DatosInstitucionalesUpdateForm({
    categoriasGeneraleList,
    idInstitucion,
    datosInstitucionales
}: {
    categoriasGeneraleList: CategoriasGenerale[];
    idInstitucion: string;
    datosInstitucionales: DatosInstitucionale[];
}) {
    const initialState: UpdateDatosInstitucionaleState = {};
    const [state, dispatch] = useActionState(updateDatosInstitucionale, initialState);

    const [createState, createDispatch] = useActionState(createDatosInstitucionale, initialState);


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const datosToProcess = categoriasGeneraleList.map(categoria => {
            const existingData = datosInstitucionales.find(d => d.categoriasGeneralesId === categoria.id);

            return {
                existingData,
                institucionesId: idInstitucion,
                categoriasGeneralesId: categoria.id,
                cantidadHombres: parseInt(formData.get(`cantidadHombres_${categoria.id}`) as string) || 0,
                cantidadMujeres: parseInt(formData.get(`cantidadMujeres_${categoria.id}`) as string) || 0,
            };
        });

        // Procesar cada dato institucional
        for (const dato of datosToProcess) {
            const formData = new FormData();

            if (dato.existingData) {
                // Si existe, usamos update
                formData.append('id', dato.existingData.id);
                formData.append('institucionesId', dato.institucionesId);
                formData.append('categoriasGeneralesId', dato.categoriasGeneralesId);
                formData.append('cantidadHombres', dato.cantidadHombres.toString());
                formData.append('cantidadMujeres', dato.cantidadMujeres.toString());
                startTransition(() => dispatch(formData));
            } else {
                // Si no existe, usamos create
                formData.append('institucionesId', dato.institucionesId);
                formData.append('categoriasGeneralesId', dato.categoriasGeneralesId);
                formData.append('cantidadHombres', dato.cantidadHombres.toString());
                formData.append('cantidadMujeres', dato.cantidadMujeres.toString());
                startTransition(() => createDispatch(formData));
            }
        }
    }

    return (
        <div>
            <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="hidden" name="institucionesId" value={idInstitucion} />

                {categoriasGeneraleList.map((categoria) => {
                    const existingData = datosInstitucionales.find(d => d.categoriasGeneralesId === categoria.id);
                    return (
                        <div key={categoria.id} className="border p-4 rounded-md">
                            <h3 className="text-lg font-semibold mb-2">{categoria.descripcion}</h3>
                            <input type="hidden" name={`categoriasGeneralesId`} value={categoria.id} />
                            {existingData && <input type="hidden" name={`id_${categoria.id}`} value={existingData.id} />}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`cantidadHombres_${categoria.id}`}>Cantidad Hombres</Label>
                                    <Input
                                        id={`cantidadHombres_${categoria.id}`}
                                        name={`cantidadHombres_${categoria.id}`}
                                        type="number"
                                        min="0"
                                        defaultValue={existingData?.cantidadHombres || 0}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`cantidadMujeres_${categoria.id}`}>Cantidad Mujeres</Label>
                                    <Input
                                        id={`cantidadMujeres_${categoria.id}`}
                                        name={`cantidadMujeres_${categoria.id}`}
                                        type="number"
                                        min="0"
                                        defaultValue={existingData?.cantidadMujeres || 0}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                <Button type="submit" className="mt-4">Actualizar</Button>
                <FormAlert state={state} />
            </form>
        </div>
    );
}

