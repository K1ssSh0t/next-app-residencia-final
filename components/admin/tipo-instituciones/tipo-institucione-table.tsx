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
import { TipoInstitucionesWithRelations } from "@/repositories/tipo-institucione-repository";

export function TipoInstitucioneTable({ tipoInstitucioneList }: { tipoInstitucioneList: TipoInstitucionesWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Descripcion</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { tipoInstitucioneList.map((tipoInstitucione) => (
          <TableRow key={ tipoInstitucione.id }>
            <TableCell>{ tipoInstitucione.id }</TableCell>
            <TableCell>{ tipoInstitucione.descripcion }</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/tipo-instituciones/${ tipoInstitucione.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/tipo-instituciones/${ tipoInstitucione.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/tipo-instituciones/${ tipoInstitucione.id }/delete`}>
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
