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
import { RegionsWithRelations } from "@/repositories/region-repository";

export function RegionTable({ regionList }: { regionList: RegionsWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className=" bg-[#631233] text-white text-lg font-bold">
          {/*Ocultado campo id usado dentro del sistema*/}
          {/*<TableHead >Id</TableHead>*/}
          <TableHead className=" text-lg text-white">Nombre</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regionList.map((region) => (
          <TableRow key={region.id}>
            {/*Ocultado campo id usado dentro del sistema*/}
            {/*<TableCell>{region.id}</TableCell>*/}
            <TableCell>{region.nombre}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              {/*Boton oculto por estar mostrados los campos en la tabla*/}
              {/*<Link href={`/admin/regiones/${region.id}`}>
                <Button size="icon" variant="outline" title="Ver Detalles">
                  <EyeIcon />
                </Button>
              </Link>*/}

              {/*Boton oculto por ser irrelevante editar una region existente en Oaxaca*/}
              {/*<Link href={`/admin/regiones/${region.id}/edit`}>
                <Button size="icon" variant="outline" title="Editar">
                  <PencilIcon />
                </Button>
              </Link>*/}

              {/*Boton oculto por ser irrelevante eliminar una region existente en Oaxaca*/}
              {/*<Link href={`/admin/regiones/${region.id}/delete`}>
                <Button size="icon" variant="outline" title="Eliminar">
                  <TrashIcon />
                </Button>
              </Link>*/}

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
