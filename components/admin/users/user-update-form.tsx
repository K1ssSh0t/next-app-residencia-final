"use client";

import { startTransition, useActionState } from "react";
import { updateUser, UpdateUserState } from "@/actions/admin/users/update-user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Input } from "@/components/ui/input";

import { User } from "@/schema/users";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UserUpdateForm({
  user,
}: {
  user: User;
}) {
  const initialState: UpdateUserState = {};
  const [state, dispatch] = useActionState(updateUser, initialState);

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
        <input type="hidden" name="id" value={user.id} />
        <div>
          <p><strong>Id:</strong> {user.id}</p>
        </div>
        <div>
          <Label>Name</Label>
          <Input name="name" defaultValue={user.name ?? ""} />
          {state.errors?.name?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Email</Label>
          <Input name="email" defaultValue={user.email ?? ""} />
          {state.errors?.email?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        {/* <div>
          <Label>Email Verified</Label>
          <Input name="emailVerified" defaultValue={ user.emailVerified?.toLocaleString() ?? "" } />
          {state.errors?.emailVerified?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div> */}
        <div>
          <Label>Image</Label>
          <Input name="image" defaultValue={user.image ?? ""} />
          {state.errors?.image?.map((error) => (
            <p className="text-red-500" key={error}>{error}</p>
          ))}
        </div>
        <div>
          <Label>Role</Label>
          <Select name="role" defaultValue={user.role ?? ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
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
          <Select name="nivelEducativo" defaultValue={user.nivelEducativo ? "true" : "false"}>
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
          <Input name="password" type="password" defaultValue={""} />
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
