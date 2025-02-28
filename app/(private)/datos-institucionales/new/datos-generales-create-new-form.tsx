"use client";

import { startTransition, useActionState, useState } from "react";
import { createDatosInstitucionale, CreateDatosInstitucionaleState } from "@/actions/private/datos-institucionales/create-datos-institucionale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { CategoriasGenerales } from "@/schema/categorias-generales";
import DecimalInput from "@/components/decimal-input";
import { parse } from "path";
import { useRouter } from "next/navigation";

export function DatosInstitucionaleCreateForm({
    categoriasGeneraleList,
    idInstitucion
}: {
    categoriasGeneraleList: CategoriasGenerales[];
    idInstitucion: string
}) {
    const initialState: CreateDatosInstitucionaleState = {};
    const [state, dispatch] = useActionState(createDatosInstitucionale, initialState);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);
        // startTransition(() => dispatch(formData));
        const datosInstitucionales = categoriasGeneraleList.map(categoria => {
            const isMontoInfraestructura = categoria.descripcion === 'MONTO ASIGNADO A INFRAESTRUCTURA GENERAL';

            let cantidadHombres = 0;

            if (isMontoInfraestructura) {
                let montoValue = (formData.get(`cantidadHombres_${categoria.id}`) as string) || '0.00';
                // Remove commas from the montoValue string
                // montoValue = montoValue.replace(/,/g, '');
                console.log(montoValue)
                cantidadHombres = parseFloat(montoValue);
            } else {
                cantidadHombres = parseInt(formData.get(`cantidadHombres_${categoria.id}`) as string) || 0;
            }

            return {
                institucionesId: idInstitucion,
                categoriasGeneralesId: categoria.id,
                cantidadHombres: cantidadHombres,
                cantidadMujeres: isMontoInfraestructura ?
                    0 : // Set cantidadMujeres to 0 for "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL"
                    parseInt(formData.get(`cantidadMujeres_${categoria.id}`) as string) || 0
            };
        });

        console.log(datosInstitucionales)

        for (const dato of datosInstitucionales) {
            const formData = new FormData
            formData.append('institucionesId', dato.institucionesId)
            formData.append('categoriasGeneralesId', dato.categoriasGeneralesId)
            formData.append('cantidadHombres', dato.cantidadHombres.toString())
            formData.append('cantidadMujeres', dato.cantidadMujeres.toString())
            startTransition(() => dispatch(formData));
        }

        //router.refresh();

        //router.back();
        //router.refresh();
        //if (state.status === 'success') router.push('/cuestionario-usuario');
        setTimeout(() => {
            // window.location.reload();
            //router.back();
            router.push('/cuestionario-usuario');
        }, 3500);
        // startTransition(() => dispatch(new FormData(datosInstitucionales as HTMLFormElement )));

    }

    return (
        <div>
            <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="hidden" name="institucionesId" value={idInstitucion} />

                {categoriasGeneraleList.map((categoria) => {
                    const isMontoInfraestructura = categoria.descripcion === 'MONTO ASIGNADO A INFRAESTRUCTURA GENERAL';
                    return (
                        <div key={categoria.id} className="border p-4 rounded-md">
                            <h3 className="text-lg font-semibold mb-2">{categoria.descripcion}</h3>
                            <input type="hidden" name={`categoriasGeneralesId`} value={categoria.id} />
                            {isMontoInfraestructura ? (
                                // Render single input for "MONTO ASIGNADO A INFRAESTRUCTURA GENERAL"
                                <div>
                                    <Label htmlFor={`cantidadHombres_${categoria.id}`}>Monto</Label>
                                    <DecimalInput
                                        id={`cantidadHombres_${categoria.id}`}
                                        name={`cantidadHombres_${categoria.id}`}
                                        onChange={(value) => {
                                            // Handle the change if needed
                                            console.log(`New value for ${categoria.descripcion}:`, value.target.value);
                                        }}
                                        precision={20}
                                        scale={2}
                                    />
                                </div>
                            ) : (
                                // Render standard two inputs
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`cantidadHombres_${categoria.id}`}>Cantidad Hombres</Label>
                                        <Input
                                            id={`cantidadHombres_${categoria.id}`}
                                            name={`cantidadHombres_${categoria.id}`}
                                            type="number"
                                            min="0"
                                            step={1}
                                            inputMode="numeric"
                                            required
                                        />

                                    </div>
                                    <div>
                                        <Label htmlFor={`cantidadMujeres_${categoria.id}`}>Cantidad Mujeres</Label>
                                        <Input
                                            id={`cantidadMujeres_${categoria.id}`}
                                            name={`cantidadMujeres_${categoria.id}`}
                                            type="number"
                                            min="0"
                                            step={1}
                                            inputMode="numeric"
                                            required
                                        />

                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                <Button type="submit" className="mt-4"

                    // disabled={state.status === 'success'}
                    disabled={loading}

                >Enviar</Button>
                <FormAlert state={state} />
            </form>
        </div>
    );
}

