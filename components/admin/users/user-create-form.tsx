"use client";

import { startTransition, useActionState } from "react";
import { createUser, CreateUserState } from "@/actions/admin/users/create-user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export function UserCreateForm() {
  const initialState: CreateUserState = {};
  const [state, dispatch] = useActionState(createUser, initialState);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    // Convert 'nivelEducativo' to boolean before dispatching
    const nivelEducativo = formData.get('nivelEducativo');
    formData.set('nivelEducativo', nivelEducativo === 'true' ? 'true' : 'false');


    startTransition(() => dispatch(formData));
  }

  return (
    <div>
      <form action={dispatch} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Label>Name</Label>
          <Input name="name" />
          {state.errors?.name?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" />
          {state.errors?.email?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        {/* <div>
          <Label>Email Verified</Label>
          <Input name="emailVerified" />
          {state.errors?.emailVerified?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div> */}
        <div>
          <Label>Image</Label>
          <Input name="image" />
          {state.errors?.image?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Role</Label>
          <Select name="role" >
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
        </div>
        <div>
          <Label>Nivel Educativo</Label>
          <Select name="nivelEducativo">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el nivel educativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Superior</SelectItem>
              <SelectItem value="false">Medio Superior</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.nivelEducativo?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Password</Label>
          <Input name="password" type="password" />
          {state.errors?.password?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
