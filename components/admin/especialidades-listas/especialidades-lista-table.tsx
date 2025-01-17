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
import { EspecialidadesListasWithRelations } from "@/repositories/especialidades-lista-repository";

export function EspecialidadesListaTable({ especialidadesListaList }: { especialidadesListaList: EspecialidadesListasWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Descripcion</TableHead>
          <TableHead>Clave</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { especialidadesListaList.map((especialidadesLista) => (
          <TableRow key={ especialidadesLista.id }>
            <TableCell>{ especialidadesLista.id }</TableCell>
            <TableCell>{ especialidadesLista.descripcion }</TableCell>
            <TableCell>{ especialidadesLista.clave }</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/especialidades-listas/${ especialidadesLista.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/especialidades-listas/${ especialidadesLista.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/especialidades-listas/${ especialidadesLista.id }/delete`}>
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
