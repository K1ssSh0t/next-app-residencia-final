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
import { CategoriasGeneralesWithRelations } from "@/repositories/categorias-generale-repository";

export function CategoriasGeneraleTable({ categoriasGeneraleList }: { categoriasGeneraleList: CategoriasGeneralesWithRelations }) {
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
        {categoriasGeneraleList.map((categoriasGenerales) => (
          <TableRow key={categoriasGenerales.id}>
            <TableCell>{categoriasGenerales.id}</TableCell>
            <TableCell>{categoriasGenerales.descripcion}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/categorias-generales/${categoriasGenerales.id}`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/categorias-generales/${categoriasGenerales.id}/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/categorias-generales/${categoriasGenerales.id}/delete`}>
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
