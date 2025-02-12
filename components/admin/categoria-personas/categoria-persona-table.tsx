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
import { CategoriaPersonasWithRelations } from "@/repositories/categoria-persona-repository";

export function CategoriaPersonaTable({ categoriaPersonaList }: { categoriaPersonaList: CategoriaPersonasWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className=" bg-[#631233] text-white text-lg font-bold" >
          {/* <TableHead>Id</TableHead> */}
          <TableHead className=" text-lg text-white">Descripción</TableHead>
          <TableHead className=" text-lg text-white">Nivel Aplicable</TableHead>
          <TableHead className=" text-lg text-white">Estado en el Cuestionario</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categoriaPersonaList.map((categoriaPersona) => (
          <TableRow key={categoriaPersona.id}>
            {/* <TableCell>{categoriaPersona.id}</TableCell> */}
            <TableCell>{categoriaPersona.descripcion}</TableCell>
            <TableCell className="capitalize">{categoriaPersona.nivelAplicado}</TableCell>
            <TableCell>{categoriaPersona.activo ? "Activo" : "Inactivo"}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/categoria-personas/${categoriaPersona.id}`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/categoria-personas/${categoriaPersona.id}/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/categoria-personas/${categoriaPersona.id}/delete`}>
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
