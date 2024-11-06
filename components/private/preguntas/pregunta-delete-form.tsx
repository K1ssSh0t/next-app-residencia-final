"use client";

import { deletePregunta, DeletePreguntaState } from "@/actions/private/preguntas/delete-pregunta";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form-alert";
import { useActionState } from "react";
import { Pregunta } from "@/schema/preguntas";

export function PreguntaDeleteForm({ pregunta }: { pregunta: Pregunta }) {
  const initialState: DeletePreguntaState = {};
  const [state, dispatch] = useActionState(deletePregunta, initialState);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-2">
        <input type="hidden" name="id" value={ pregunta.id} />
        <div>
          <p><strong>Id:</strong> { pregunta.id}</p>
        </div>
        <div>
          <Button type="submit" variant="destructive">
            Delete
          </Button>
        </div>
        <FormAlert state={state} />
      </form>
    </div>
  );
}
