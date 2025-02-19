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
import { MunicipiosWithRelations } from "@/repositories/municipio-repository";

export function MunicipioTable({ municipioList }: { municipioList: MunicipiosWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className=" bg-[#631233] text-white text-lg font-bold">
          <TableHead>Id</TableHead>
          <TableHead className=" text-lg text-white">Nombre</TableHead>
          <TableHead className=" text-lg text-white">Región</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {municipioList.map((municipio) => (
          <TableRow key={municipio.id}>
            <TableCell>{municipio.id}</TableCell>
            <TableCell>{municipio.nombre}</TableCell>
            <TableCell>{municipio.region?.nombre}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/municipios/${municipio.id}`}>
                <Button size="icon" variant="outline" title="Ver Detalles">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/municipios/${municipio.id}/edit`}>
                <Button size="icon" variant="outline" title="Editar">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/municipios/${municipio.id}/delete`}>
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
