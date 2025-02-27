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
        <TableRow className=" bg-[#631233] text-white text-lg font-bold">
          {/*Ocultado campo id usado dentro del sistema*/}
          {/*<TableHead>Id</TableHead>*/}
          <TableHead className=" text-lg text-white">Descripción</TableHead>
          <TableHead className=" text-lg text-white">Estado en el Cuestionario</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categoriasGeneraleList.map((categoriasGenerales) => (
          <TableRow key={categoriasGenerales.id}>
            {/*Ocultado campo id usado dentro del sistema*/}
            {/*<TableCell>{categoriasGenerales.id}</TableCell>*/}
            <TableCell>{categoriasGenerales.descripcion}</TableCell>
            <TableCell>{categoriasGenerales.activo ? "Activo" : "Inactivo"}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              {/*Ocultado boton ver detalles por apreciarse los botones en la tabla*/}
              {/*<Link href={`/admin/categorias-generales/${categoriasGenerales.id}`}>
                <Button size="icon" variant="outline" title="Ver Detalles">
                  <EyeIcon />
                </Button>
              </Link>*/}
              <Link href={`/admin/categorias-generales/${categoriasGenerales.id}/edit`}>
                <Button size="icon" variant="outline" title="Editar">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/categorias-generales/${categoriasGenerales.id}/delete`}>
                <Button size="icon" variant="outline" title="Eliminar">
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
