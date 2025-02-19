"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { updateUser, UpdateUserState } from "@/actions/admin/users/update-user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
<<<<<<< HEAD

import { User } from "@/schema/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

=======

import { User } from "@/schema/users";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react"

>>>>>>> 17a59fa (Guardando cambios antes del pull)
export function UserUpdateForm({ user }: { user: User }) {
  const initialState: UpdateUserState = {};
  const [state, dispatch] = useActionState(updateUser, initialState);
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // 2. Declara una referencia para el input "Nombre de Usuario":
  const emailRef = useRef<HTMLInputElement>(null);

  // Función para generar una contraseña aleatoria
  const generateRandomPassword = () => {
    const length = 15;
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Asegurar al menos uno de cada tipo
    let pass =
      upper.charAt(Math.floor(Math.random() * upper.length)) +
      lower.charAt(Math.floor(Math.random() * lower.length)) +
      numbers.charAt(Math.floor(Math.random() * numbers.length)) +
      special.charAt(Math.floor(Math.random() * special.length));

    // Caracteres restantes aleatorios de todos los tipos
    const allChars = upper + lower + numbers + special;
    for (let i = pass.length; i < length; i++) {
      pass += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Mezclar la contraseña final
    return pass
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  // 4. Crea la función para copiar las credenciales:
  const copyCredentials = () => {
    const email = emailRef.current?.value || "";
    const pwd = password;
    const textToCopy = `Nombre de usuario: ${email}\nContraseña: ${pwd}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Credenciales copiadas al portapapeles!");
      })
      .catch(() => {
        alert("Error al copiar las credenciales");
      });
  };

  useEffect(() => {
    setSelectedRole(user.role);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    // Convert 'nivelEducativo' to boolean before dispatching
    const nivelEducativo = formData.get("nivelEducativo");
    formData.set(
      "nivelEducativo",
      nivelEducativo === "true" ? "true" : "false",
    );


    startTransition(() => dispatch(formData));
          Swal.fire({
            title: "Guardado",
            text: "Se han guardado los datos.",
            icon: "success",
            confirmButtonColor: "#631233",
            timer: 2000, 
            timerProgressBar: true
            
          });
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-yellow-700">
          Los campos de correo electrónico, rol y contraseña son requeridos.
        </p>
      </div>
      <form
        action={dispatch}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
      >
        <input type="hidden" name="id" value={user.id} />
        <div>
          <p>
            <strong>Id:</strong> {user.id}
          </p>
        </div>
        <div className="hidden">
          <Label>Name</Label>
          <Input name="name" defaultValue={user.name ?? ""} />
          {state.errors?.name?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label htmlFor="email">Nombre de usuario *</Label>
          <Input
            name="email"
            defaultValue={user.email ?? ""}
            required
            ref={emailRef}
          />
          {state.errors?.email?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label htmlFor="correoContacto"> Correo Contacto</Label>
          <Input
            name="correoContacto"
            defaultValue={user.correoContacto ?? ""}
            type="email"
          />
          {state.errors?.correoContacto?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label htmlFor="nombreContacto">Nombre del Responsable</Label>
          <Input
            name="nombreContacto"
            defaultValue={user.nombreContacto ?? ""}
          />
          {state.errors?.nombreContacto?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        {/* <div>
          <Label>Email Verified</Label>
          <Input name="emailVerified" defaultValue={ user.emailVerified?.toLocaleString() ?? "" } />
          {state.errors?.emailVerified?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div> */}
        <div className="hidden">
          <Label>Image</Label>
          <Input name="image" defaultValue={user.image ?? ""} />
          {state.errors?.image?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div>
          <Label htmlFor="role">Rol *</Label>
          <Select
            name="role"
            defaultValue={user.role ?? ""}
            required
            onValueChange={(value) => setSelectedRole(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
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
        </div>
        <div>
          <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
          <Select
            name="nivelEducativo"
            defaultValue={user.nivelEducativo ? "true" : "false"}
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
        </div>
        <div>
          <Label htmlFor="password">Contraseña *</Label>
          <div className="flex w-full items-center space-x-2">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setPassword(generateRandomPassword())}
            >
              Generar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {state.errors?.password?.map((error) => (
            <p className="text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Button type="submit">Enviar</Button>
          <Button type="button" onClick={copyCredentials}>
            Copiar Credenciales
          </Button>
        </div>
        {/*<FormAlert state={state} />*/}
      </form>
    </div>
  );
}
