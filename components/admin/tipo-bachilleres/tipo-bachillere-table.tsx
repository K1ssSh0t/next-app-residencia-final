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
import { TipoBachilleresWithRelations } from "@/repositories/tipo-bachillere-repository";

export function TipoBachillereTable({ tipoBachillereList }: { tipoBachillereList: TipoBachilleresWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className=" bg-[#631233] text-white text-lg font-bold">
          {/*Ocultado campo id usado dentro del sistema*/}
          {/*<TableHead>Id</TableHead>*/}
          <TableHead className=" text-lg text-white">Descripción</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { tipoBachillereList.map((tipoBachillere) => (
          <TableRow key={ tipoBachillere.id }>
            {/*Ocultado campo id usado dentro del sistema*/}
            {/*<TableCell>{ tipoBachillere.id }</TableCell>*/}
            <TableCell>{ tipoBachillere.descripcion }</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              {/*Ocultado Ver Detalles por mostrarse los datos en la tabla*/}
              {/*<Link href={`/admin/tipo-bachilleres/${ tipoBachillere.id }`}>
                <Button size="icon" variant="outline" title="Ver Detalles">
                  <EyeIcon />
                </Button>
              </Link>*/}
              <Link href={`/admin/tipo-bachilleres/${ tipoBachillere.id }/edit`}>
                <Button size="icon" variant="outline" title="Editar">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/tipo-bachilleres/${ tipoBachillere.id }/delete`}>
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
