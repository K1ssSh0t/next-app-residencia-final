"use client";

import { startTransition, useActionState, useState } from "react";
import { createUser, CreateUserState } from "@/actions/admin/users/create-user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

// Define Zod schema for form validation
const userCreateSchema = z.object({
  email: z.string().email("Correo inválido"),
  role: z.enum(["admin", "user", "guest"], {
    errorMap: () => ({ message: "Selecciona un rol válido" }),
  }),
  nivelEducativo: z.enum(["true", "false", "unspecified"], {
    errorMap: () => ({ message: "Selecciona un nivel educativo válido" }),
  }).optional(),
  password: z.string().min(5, "La contraseña debe ser de por lo menos 5 caracteres"),
}).refine((data) => {
  if (data.role !== "admin" && data.nivelEducativo === undefined) {
    return false;
  }
  return true;
}, {
  message: "Nivel educativo es requerido para roles que no son admin",
  path: ["nivelEducativo"],
});

export function UserCreateForm() {
  const initialState: CreateUserState = {};
  const [state, dispatch] = useActionState(createUser, initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [selectedRole, setSelectedRole] = useState<string | undefined>();


  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({})

    const formData = new FormData(event.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData.entries());

    try {
      // Validate form data
      userCreateSchema.parse(formValues);

      // If validation passes, dispatch the action
      // Convert 'nivelEducativo' to boolean before dispatching
      const nivelEducativo = formData.get('nivelEducativo');
      formData.set('nivelEducativo', nivelEducativo === 'true' ? 'true' : 'false');


      startTransition(() => dispatch(formData));
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const fieldErrors: { [key: string]: string } = {}
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)

      }
    }



  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="hidden">
          <Label>Name</Label>
          <Input name="name" />
          {state.errors?.name?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}

        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" id="email" required />
          {state.errors?.email?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

        </div>
        {/* <div>
          <Label>Email Verified</Label>
          <Input name="emailVerified" />
          {state.errors?.emailVerified?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div> */}
        <div className="hidden">
          <Label>Image</Label>
          <Input name="image" />
          {state.errors?.image?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label htmlFor="role">Rol</Label>
          <Select
            name="role"
            required
            onValueChange={(value) => setSelectedRole(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.role?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}

        </div>
        <div>
          <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
          <Select
            name="nivelEducativo"
            required={selectedRole !== "admin"}
            disabled={selectedRole === "admin"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el nivel educativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Superior</SelectItem>
              <SelectItem value="false">Medio Superior</SelectItem>
              <SelectItem value="unspecified">No especificado</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.nivelEducativo?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
          {errors.nivelEducativo && <p className="text-red-500 text-sm mt-1">{errors.nivelEducativo}</p>}

        </div>
        <div>
          <Label>Contraseña</Label>
          <Input name="password" type="password" id="password" required />
          {state.errors?.password?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

        </div>
        <div>
          <Button type="submit">Enviar</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
