"use client";

import { startTransition, useActionState } from "react";
import { updateDatosInstitucionale, UpdateDatosInstitucionaleState } from "@/actions/private/datos-institucionales/update-datos-institucionale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { CategoriasGenerales } from "@/schema/categorias-generales";
import { DatosInstitucionales } from "@/schema/datos-institucionales";


//TODO: AGREGAR UN INDEX PARA QUE SEA UNICO LA INSTITUCION CON LA CATEGORIA
// Y TAMBIEN QUE SI NO EXISTE QUE LO CREEE , CHECAR EN V0 LA RESPUESTA
export function DatosInstitucionalesUpdateForm({
    categoriasGeneraleList,
    idInstitucion,
    datosInstitucionales
}: {
    categoriasGeneraleList: CategoriasGenerales[];
    idInstitucion: string;
    datosInstitucionales: DatosInstitucionales[];
}) {
    const initialState: UpdateDatosInstitucionaleState = {};
    const [state, dispatch] = useActionState(updateDatosInstitucionale, initialState);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const updatedDatosInstitucionales = categoriasGeneraleList.map(categoria => {
            const existingData = datosInstitucionales.find(d => d.categoriasGeneralesId === categoria.id);
            return {
                id: existingData?.id,
                institucionesId: idInstitucion,
                categoriasGeneralesId: categoria.id,
                cantidadHombres: parseInt(formData.get(`cantidadHombres_${categoria.id}`) as string) || 0,
                cantidadMujeres: parseInt(formData.get(`cantidadMujeres_${categoria.id}`) as string) || 0
            };
        });

        for (const dato of updatedDatosInstitucionales) {
            const formData = new FormData();
            formData.append('id', dato.id || '');
            formData.append('institucionesId', dato.institucionesId);
            formData.append('categoriasGeneralesId', dato.categoriasGeneralesId);
            formData.append('cantidadHombres', dato.cantidadHombres.toString());
            formData.append('cantidadMujeres', dato.cantidadMujeres.toString());
            startTransition(() => dispatch(formData));
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

