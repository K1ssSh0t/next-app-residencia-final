"use client";

import { startTransition, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { UpdateUserState } from "@/actions/private/user/update-user";
import { updateUserContact } from "@/actions/private/user/update-user";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export function ContactForm({ initialData }: { initialData: { nombreContacto?: string, correoContacto?: string, userid?: string } }) {
    const initialState: UpdateUserState = {};
    const [state, dispatch] = useActionState(updateUserContact, initialState);
    const router = useRouter();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        startTransition(() => dispatch(formData));

        Swal.fire({
            title: "Guardado",
            text: "Se han guardado los datos.",
            icon: "success",
            confirmButtonColor: "#631233",
            timer: 2000,
            timerProgressBar: true
        });
        
        console.log(state);

        // if (state.status === "success") {
        //     router.push("/instituciones");
        // }
    }

    useEffect(() => {
        if (state.status === "success") {
            router.push("/instituciones");
        }
    }, [state, dispatch]);

    return (
        <div>
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                <p className="text-yellow-700">Por favor complete sus datos de contacto</p>
            </div>

            <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="hidden" name="id" value={initialData.userid} />
                <div>
                    <Label htmlFor="nombreContacto">Nombre del Responsable</Label>
                    <Input
                        name="nombreContacto"
                        id="nombreContacto"
                        defaultValue={initialData.nombreContacto}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="correoContacto">Correo de Contacto</Label>
                    <Input
                        name="correoContacto"
                        id="correoContacto"
                        type="email"
                        defaultValue={initialData.correoContacto}
                        required
                    />
                </div>

                <Button type="submit">Guardar datos de contacto</Button>
                <FormAlert state={state} />
            </form>
        </div>
    );
}