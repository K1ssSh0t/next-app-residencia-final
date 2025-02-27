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
        <TableRow className=" bg-[#631233] text-white text-lg font-bold">
          {/*Ocultado campo id usado dentro del sistema*/}
          {/*<TableHead>Id</TableHead>*/}
          <TableHead className=" text-lg text-white">Clave</TableHead>
          <TableHead className=" text-lg text-white">Descripción</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { especialidadesListaList.map((especialidadesLista) => (
          <TableRow key={ especialidadesLista.id }>
            {/*Ocultado campo id usado dentro del sistema*/}
            {/*<TableCell>{ especialidadesLista.id }</TableCell>*/}
            <TableCell>{ especialidadesLista.clave }</TableCell>
            <TableCell>{ especialidadesLista.descripcion }</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              {/*Ocultado campo ver detalles datos visibles en la tabla*/}
              {/*<Link href={`/admin/especialidades-listas/${ especialidadesLista.id }`}>
                <Button size="icon" variant="outline" title="Ver Detalles">
                  <EyeIcon />
                </Button>
              </Link>*/}

              <Link href={`/admin/especialidades-listas/${ especialidadesLista.id }/edit`}>
                <Button size="icon" variant="outline" title="Editar">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/especialidades-listas/${ especialidadesLista.id }/delete`}>
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
