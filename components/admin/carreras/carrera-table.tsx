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
import { CarrerasWithRelations } from "@/repositories/carrera-repository";

export function CarreraTable({ carreraList }: { carreraList: CarrerasWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className=" bg-[#631233] text-white text-lg font-bold">
          <TableHead className=" text-lg text-white">Clave</TableHead>
          <TableHead className=" text-lg text-white">Descripción</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carreraList.map((carrera) => (
          <TableRow key={carrera.id}>
            <TableCell>{carrera.clave}</TableCell>
            <TableCell>{carrera.descripcion}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              {/*Ocultado Ver Detalles por mostrarse los datos en la tabla*/}
              {/*<Link href={`/admin/carreras/${carrera.id}`}>
                <Button size="icon" variant="outline" title="Ver Detalles">
                  <EyeIcon />
                </Button>
              </Link>*/}
              <Link href={`/admin/carreras/${carrera.id}/edit`}>
                <Button size="icon" variant="outline" title="Editar">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/carreras/${carrera.id}/delete`} >
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
