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
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Region</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { municipioList.map((municipio) => (
          <TableRow key={ municipio.id }>
            <TableCell>{ municipio.id }</TableCell>
            <TableCell>{ municipio.nombre }</TableCell>
            <TableCell>{ municipio.regionId }</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/municipios/${ municipio.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/municipios/${ municipio.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/municipios/${ municipio.id }/delete`}>
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
