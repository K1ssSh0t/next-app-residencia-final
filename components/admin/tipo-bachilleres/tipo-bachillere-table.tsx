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
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Descripcion</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { tipoBachillereList.map((tipoBachillere) => (
          <TableRow key={ tipoBachillere.id }>
            <TableCell>{ tipoBachillere.id }</TableCell>
            <TableCell>{ tipoBachillere.descripcion }</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/tipo-bachilleres/${ tipoBachillere.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/tipo-bachilleres/${ tipoBachillere.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/tipo-bachilleres/${ tipoBachillere.id }/delete`}>
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
