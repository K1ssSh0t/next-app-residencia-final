"use client";

import { startTransition, useActionState } from "react";
import { createDatosInstitucionale, CreateDatosInstitucionaleState } from "@/actions/private/datos-institucionales/create-datos-institucionale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { CategoriasGenerales } from "@/schema/categorias-generales";

export function DatosInstitucionaleCreateForm({
    categoriasGeneraleList,
    idInstitucion
}: {
    categoriasGeneraleList: CategoriasGenerales[];
    idInstitucion: string
}) {
    const initialState: CreateDatosInstitucionaleState = {};
    const [state, dispatch] = useActionState(createDatosInstitucionale, initialState);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        // startTransition(() => dispatch(formData));
        const datosInstitucionales = categoriasGeneraleList.map(categoria => ({
            institucionesId: idInstitucion,
            categoriasGeneralesId: categoria.id,
            cantidadHombres: parseInt(formData.get(`cantidadHombres_${categoria.id}`) as string) || 0,
            cantidadMujeres: parseInt(formData.get(`cantidadMujeres_${categoria.id}`) as string) || 0
        }));

        console.log(datosInstitucionales)

        for (const dato of datosInstitucionales) {
            const formData = new FormData
            formData.append('institucionesId', dato.institucionesId)
            formData.append('categoriasGeneralesId', dato.categoriasGeneralesId)
            formData.append('cantidadHombres', dato.cantidadHombres.toString())
            formData.append('cantidadMujeres', dato.cantidadMujeres.toString())
            startTransition(() => dispatch(formData));
        }

        // startTransition(() => dispatch(new FormData(datosInstitucionales as HTMLFormElement )));

    }

    return (
        <div>
            <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="hidden" name="institucionesId" value={idInstitucion} />

                {categoriasGeneraleList.map((categoria) => (
                    <div key={categoria.id} className="border p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">{categoria.descripcion}</h3>
                        <input type="hidden" name={`categoriasGeneralesId`} value={categoria.id} />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`cantidadHombres_${categoria.id}`}>Cantidad Hombres</Label>
                                <Input
                                    id={`cantidadHombres_${categoria.id}`}
                                    name={`cantidadHombres_${categoria.id}`}
                                    type="number"
                                    min="0"
                                />

                            </div>
                            <div>
                                <Label htmlFor={`cantidadMujeres_${categoria.id}`}>Cantidad Mujeres</Label>
                                <Input
                                    id={`cantidadMujeres_${categoria.id}`}
                                    name={`cantidadMujeres_${categoria.id}`}
                                    type="number"
                                    min="0"
                                />

                            </div>
                        </div>
                    </div>
                ))}

                <Button type="submit" className="mt-4">Enviar</Button>
                <FormAlert state={state} />
            </form>
        </div>
    );
}

