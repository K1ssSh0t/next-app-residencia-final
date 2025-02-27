import { EyeIcon, PencilIcon, TrashIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CuestionariosWithRelations, CuestionarioWithRelations } from "@/repositories/cuestionario-repository";
import { db } from "@/lib/db";
import { categoriaPersonas } from "@/schema/categoria-personas";
import { eq, or, and } from "drizzle-orm";

export async function CuestionarioTable({ cuestionarioList }: { cuestionarioList: CuestionariosWithRelations }) {
  const estadoCuestionario = await db.query.helpers.findFirst();

  // Get counts for each questionnaire
  const questionnaireData = await Promise.all(cuestionarioList.map(async (cuestionario) => {
    const applicableNivel = cuestionario.user?.nivelEducativo ? "superior" : "medioSuperior";

    // Get required categories count with additional activo filter
    const requiredCategories = await db.select().from(categoriaPersonas).where(
      and(
        or(
          eq(categoriaPersonas.nivelAplicado, applicableNivel),
          eq(categoriaPersonas.nivelAplicado, "ambos")
        ),
        eq(categoriaPersonas.activo, true)
      )
    );

    return {
      id: cuestionario.id,
      requiredQuestions: requiredCategories.length,
      currentQuestions: cuestionario.preguntas?.length || 0
    };
  }));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead>Id</TableHead> */}
          <TableHead>Año</TableHead>
          <TableHead>Carrera</TableHead>
          {/* <TableHead>Nombre Revoe</TableHead> */}
          <TableHead>Plan de Estudio</TableHead>
          <TableHead>Modalidad</TableHead>
          <TableHead>Numero Revoe</TableHead>
          {/* <TableHead>Users</TableHead> */}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cuestionarioList.map((cuestionario: any) => {
          const questData = questionnaireData.find(q => q.id === cuestionario.id);
          const hasAllQuestions = questData?.currentQuestions === questData?.requiredQuestions;

          return (
            <TableRow key={cuestionario.id}>
              {/* <TableCell>{cuestionario.id}</TableCell> */}
              <TableCell>{cuestionario.año}</TableCell>
              <TableCell>{cuestionario.carrera?.carrera?.descripcion}</TableCell>
              {/* <TableCell>{cuestionario.carrera?.nombreRevoe}</TableCell> */}
              <TableCell>{cuestionario.carrera?.planDeEstudio}</TableCell>
              <TableCell>{cuestionario.carrera?.modalidad?.descripcion}</TableCell>
              <TableCell>{cuestionario.carrera?.numeroRevoe}</TableCell>
              {/* <TableCell>{cuestionario.usersId}</TableCell> */}
              <TableCell className="justify-end flex gap-2">
                <Link href={`/cuestionarios/${cuestionario.id}`}>
                  <Button
                    variant="outline"
                    className={cn(
                      hasAllQuestions
                        ? "bg-green-100 hover:bg-green-200 text-green-700"
                        : "bg-red-100 hover:bg-red-200 text-red-700"
                    )}
                  >
                    {hasAllQuestions
                      ? "Ver datos"
                      : `Faltan ${(questData?.requiredQuestions ?? 0) - (questData?.currentQuestions ?? 0)} preguntas`
                    }
                  </Button>
                </Link>
                {estadoCuestionario?.estadoCuestionario && cuestionario.user.nivelEducativo && (
                  <Link href={`/carrera-instituciones/${cuestionario.carrerasId}/edit`}>
                    <Button size="icon" variant="outline">
                      <PencilIcon />
                    </Button>
                  </Link>
                )}
                {/* <Link href={`/cuestionarios/${cuestionario.id}/delete`}>
                  <Button size="icon" variant="outline">
                    <TrashIcon />
                  </Button>
                </Link> */}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
