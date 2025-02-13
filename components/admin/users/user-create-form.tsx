"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { createUser, CreateUserState } from "@/actions/admin/users/create-user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

// Define Zod schema for form validation
const userCreateSchema = z
  .object({
    email: z.string(),
    role: z.enum(["admin", "user", "consultor", "operador"], {
      errorMap: () => ({ message: "Selecciona un rol válido" }),
    }),
    nivelEducativo: z
      .enum(["true", "false", "unspecified"], {
        errorMap: () => ({ message: "Selecciona un nivel educativo válido" }),
      })
      .optional(),
    correoContacto: z.string().optional().or(z.string().email("El correo debe tener un formato valido")),
    nombreContacto: z.string().optional(),
    password: z.string().min(5, "La contraseña debe ser de por lo menos 5 caracteres"),
  })
  .refine(
    (data) => {
      if (data.role === "user" && data.nivelEducativo === undefined) {
        return false;
      }
      return true;
    },
    {
      message: "Nivel educativo es requerido para el rol de usuario",
      path: ["nivelEducativo"],
    }
  );

export function UserCreateForm() {
  const initialState: CreateUserState = {};
  const [state, dispatch] = useActionState(createUser, initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // 2. Declara una referencia para el input "Nombre de Usuario":
  const emailRef = useRef<HTMLInputElement>(null);

  // Función para generar una contraseña aleatoria
  const generateRandomPassword = (length = 10) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // 4. Crea la función para copiar las credenciales:
  const copyCredentials = () => {
    const email = emailRef.current?.value || "";
    const pwd = password;
    const textToCopy = `Nombre de usuario: ${email}\nContraseña: ${pwd}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert("Credenciales copiadas al portapapeles!");
      })
      .catch(() => {
        alert("Error al copiar las credenciales");
      });
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData.entries());

    try {
      // Validate form data
      userCreateSchema.parse(formValues);

      // Convertir 'nivelEducativo' a boolean antes de despachar
      const nivelEducativo = formData.get("nivelEducativo");
      formData.set("nivelEducativo", nivelEducativo === "true" ? "true" : "false");

      startTransition(() => dispatch(formData));
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Manejo de errores de validación
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">
          Los campos de correo electrónico, rol y contraseña son requeridos.
        </p>
      </div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="hidden">
          <Label>Name</Label>
          <Input name="name" />
          {state.errors?.name?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label htmlFor="email">Nombre de Usuario *</Label>
          <Input name="email" id="email" required ref={emailRef} />
          {state.errors?.email?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="correoContacto">Correo de Contacto </Label>
          <Input name="correoContacto" id="correoContacto" type="email" />
          {state.errors?.correoContacto?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
          {errors.correoContacto && (
            <p className="text-red-500 text-sm mt-1">{errors.correoContacto}</p>
          )}
        </div>
        <div>
          <Label htmlFor="nombreContacto">Nombre del Responsable </Label>
          <Input name="nombreContacto" id="nombreContacto" />
          {state.errors?.nombreContacto?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
          {errors.nombreContacto && (
            <p className="text-red-500 text-sm mt-1">{errors.nombreContacto}</p>
          )}
        </div>
        <div className="hidden">
          <Label>Image</Label>
          <Input name="image" />
          {state.errors?.image?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label htmlFor="role">Rol *</Label>
          <Select name="role" required onValueChange={(value) => setSelectedRole(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="user">Usuario de Institución</SelectItem>
              <SelectItem value="operador">Operador</SelectItem>
              <SelectItem value="consultor">Consultor</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.role?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
        </div>
        <div>
          <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
          <Select
            name="nivelEducativo"
            required={selectedRole === "user"}
            disabled={selectedRole !== "user"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el nivel educativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Superior</SelectItem>
              <SelectItem value="false">Medio Superior</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.nivelEducativo?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
          {errors.nivelEducativo && (
            <p className="text-red-500 text-sm mt-1">{errors.nivelEducativo}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Contraseña *</Label>
          {/* Contenedor modificado para incluir el botón de "Generar" */}
          <div className="flex w-full items-center space-x-2">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setPassword(generateRandomPassword(10))}
            >
              Generar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {state.errors?.password?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Button type="submit">Enviar</Button>
          <Button type="button" onClick={copyCredentials}>
            Copiar Credenciales
          </Button>
        </div>

        <FormAlert state={state} />
      </form>
    </div>
  );
}
