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
import { EspecialidadsWithRelations } from "@/repositories/especialidad-repository";

export function EspecialidadTable({ especialidadList }: { especialidadList: EspecialidadsWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Hombres</TableHead>
          <TableHead>Mujeres</TableHead>
          <TableHead>Cuestionario</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {especialidadList.map((especialidad) => (
          <TableRow key={especialidad.id}>
            <TableCell>{especialidad.id}</TableCell>
            <TableCell>{especialidad.nombre}</TableCell>
            <TableCell>{especialidad.hombres}</TableCell>
            <TableCell>{especialidad.mujeres}</TableCell>
            <TableCell>{especialidad.cuestionarioId}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/especialidades/${especialidad.id}`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/especialidades/${especialidad.id}/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/especialidades/${especialidad.id}/delete`}>
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
