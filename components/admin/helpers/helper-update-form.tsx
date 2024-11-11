"use client";

import { startTransition, useActionState, useState } from "react";
import { updateHelper, UpdateHelperState } from "@/actions/admin/helpers/update-helper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/form-alert";
import { Checkbox } from "@/components/ui/checkbox";

import { Helper } from "@/schema/helpers";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export function HelperUpdateForm({
  helper,
}: {
  helper: Helper;
}) {
  const initialState: UpdateHelperState = {};
  const [state, dispatch] = useActionState(updateHelper, initialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newState, setNewState] = useState(helper.estadoCuestionario ?? false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsDialogOpen(true);
  }

  function handleConfirm() {
    const formData = new FormData();
    formData.append("id", helper.id);
    formData.append("estadoCuestionario", newState.toString());
    startTransition(() => dispatch(formData));
    setIsDialogOpen(false);
  }


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Actualizar Helper</CardTitle>
        <CardDescription>Modifica el estado del cuestionario para este helper.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="estadoCuestionario" className="text-sm font-medium">
              Estado del cuestionario
            </Label>
            <Switch
              id="estadoCuestionario"
              checked={newState}
              onCheckedChange={setNewState}
            />
          </div>
          {state.errors?.estadoCuestionario?.map((error) => (
            <p className="text-sm text-red-500" key={error}>{error}</p>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Actualizar</Button>
        </CardFooter>
      </form>
      <FormAlert state={state} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de estado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cambiar el estado del cuestionario a {newState ? "Activo" : "Inactivo"}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
