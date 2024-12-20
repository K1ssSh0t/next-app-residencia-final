import { EyeIcon, PencilIcon, TrashIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CuestionariosWithRelations } from "@/repositories/cuestionario-repository";

export function CuestionarioTable({ cuestionarioList }: { cuestionarioList: CuestionariosWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead>Id</TableHead> */}
          <TableHead>Año</TableHead>
          <TableHead>Carrera</TableHead>
          <TableHead>Nombre Revoe</TableHead>
          <TableHead>Plan de Estudio</TableHead>
          <TableHead>Modalidad</TableHead>
          <TableHead>Numero Revoe</TableHead>
          {/* <TableHead>Users</TableHead> */}
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cuestionarioList.map((cuestionario: any) => (
          <TableRow key={cuestionario.id}>
            {/* <TableCell>{cuestionario.id}</TableCell> */}
            <TableCell>{cuestionario.año}</TableCell>
            <TableCell>{cuestionario.carrera?.carrera?.descripcion}</TableCell>
            <TableCell>{cuestionario.carrera?.nombreRevoe}</TableCell>
            <TableCell>{cuestionario.carrera?.planDeEstudio}</TableCell>
            <TableCell>{cuestionario.carrera?.modalidad?.descripcion}</TableCell>
            <TableCell>{cuestionario.carrera?.numeroRevoe}</TableCell>
            {/* <TableCell>{cuestionario.usersId}</TableCell> */}
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/cuestionarios/${cuestionario.id}`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/carrera-instituciones/${cuestionario.carrerasId}/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/cuestionarios/${cuestionario.id}/delete`}>
                <Button size="icon" variant="outline">
                  <TrashIcon />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
