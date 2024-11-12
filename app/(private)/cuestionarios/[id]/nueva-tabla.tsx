'use client'

import { useState, useActionState, useTransition } from 'react'
import { PreguntasWithRelations } from "@/repositories/pregunta-repository"
import { CategoriaPersona } from "@/schema/categoria-personas"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SaveIcon, Loader2 } from "lucide-react"
import { updatePregunta, UpdatePreguntaState } from '@/actions/private/preguntas/update-pregunta'
import { createPregunta, CreatePreguntaState } from '@/actions/private/preguntas/create-pregunta'
//import { useFormState } from 'react-dom'
import { toast, useToast } from "@/hooks/use-toast"

interface PreguntaFormProps {
    preguntaList: PreguntasWithRelations
    categoriasList: CategoriaPersona[]
    cuestionarioId: string
}

interface FormValues {
    [key: string]: {
        cantidadMujeres: number | any
        cantidadHombres: number | any
        categoriaId: string
        isNew?: boolean
    }
}

export default function PreguntaForm({ preguntaList, categoriasList, cuestionarioId }: PreguntaFormProps) {
    const [formValues, setFormValues] = useState<FormValues>(() => {
        const initialValues: FormValues = {}

        preguntaList.forEach(pregunta => {
            initialValues[pregunta.id] = {
                cantidadMujeres: pregunta.cantidadMujeres,
                cantidadHombres: pregunta.cantidadHombres,
                //@ts-ignore
                categoriaId: pregunta.categoriaPersona.id
            }
        })

        categoriasList.forEach(categoria => {
            const tienePreguntas = preguntaList.some(
                //@ts-ignore
                pregunta => pregunta.categoriaPersona.id === categoria.id
            )

            if (!tienePreguntas) {
                const newId = `new-${categoria.id}`
                initialValues[newId] = {
                    cantidadMujeres: 0,
                    cantidadHombres: 0,
                    categoriaId: categoria.id,
                    isNew: true
                }
            }
        })

        return initialValues
    })

    // const upinitialState: UpdatePreguntaState = {};
    // const initialState: CreatePreguntaState = {};
    // const [updateState, updateAction] = useActionState<UpdatePreguntaState, FormData>(updatePregunta, upinitialState)
    // const [createState, createAction] = useActionState<CreatePreguntaState, FormData>(createPregunta, initialState)

    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const handleInputChange = (
        id: string,
        field: 'cantidadMujeres' | 'cantidadHombres',
        value: string
    ) => {
        setFormValues(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: parseInt(value) || 0
            }
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            try {
                const existingRecords = Object.entries(formValues)
                    .filter(([_, value]) => !value.isNew)

                const newRecords = Object.entries(formValues)
                    .filter(([_, value]) => value.isNew)

                for (const [id, value] of existingRecords) {
                    const formData = new FormData()
                    formData.append('id', id)
                    formData.append('categoriaPersonasId', value.categoriaId)
                    formData.append('cuestionariosId', cuestionarioId)
                    formData.append('cantidadMujeres', value.cantidadMujeres.toString())
                    formData.append('cantidadHombres', value.cantidadHombres.toString())
                    const result = await updatePregunta({} as UpdatePreguntaState, formData)
                    if (result.status === 'error') {
                        throw new Error('Error updating pregunta')
                    }
                }

                for (const [_, value] of newRecords) {
                    const formData = new FormData()
                    formData.append('categoriaPersonasId', value.categoriaId)
                    formData.append('cuestionariosId', cuestionarioId)
                    formData.append('cantidadMujeres', value.cantidadMujeres.toString())
                    formData.append('cantidadHombres', value.cantidadHombres.toString())
                    const result = await createPregunta({} as CreatePreguntaState, formData)
                    if (result.status === 'error') {
                        throw new Error('Error creating pregunta')
                    }
                }

                toast({
                    title: "Cambios guardados",
                    description: "Los cambios se han guardado correctamente.",
                })
            } catch (error) {
                console.error('Error al guardar los cambios:', error)
                toast({
                    title: "Error",
                    description: "Hubo un problema al guardar los cambios.",
                    variant: "destructive",
                })
            }
        })
    }

    const getFormFieldsByCategoria = (categoriaId: string) => {
        return Object.entries(formValues).filter(([_, value]) =>
            value.categoriaId === categoriaId
        )
    }

    //const isLoading = updateState.status === undefined || createState.status === undefined


    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {categoriasList.map((categoria) => (
                <Card key={categoria.id}>
                    <CardHeader>
                        <CardTitle>{categoria.descripcion}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {getFormFieldsByCategoria(categoria.id).map(([id, values]) => (
                            <div key={id} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <Label htmlFor={`mujeres-${id}`} className="text-sm font-medium">
                                        Mujeres
                                    </Label>
                                    <Input
                                        id={`mujeres-${id}`}
                                        type="number"
                                        value={values.cantidadMujeres}
                                        onChange={(e) => handleInputChange(id, 'cantidadMujeres', e.target.value)}
                                        className="w-full"
                                        placeholder="Ingrese cantidad"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Ingrese la cantidad de mujeres.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`hombres-${id}`} className="text-sm font-medium">
                                        Hombres
                                    </Label>
                                    <Input
                                        id={`hombres-${id}`}
                                        type="number"
                                        value={values.cantidadHombres}
                                        onChange={(e) => handleInputChange(id, 'cantidadHombres', e.target.value)}
                                        className="w-full"
                                        placeholder="Ingrese cantidad"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Ingrese la cantidad de hombres.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        Guardar Cambios
                    </>
                )}
            </Button>
        </form>
    )
}