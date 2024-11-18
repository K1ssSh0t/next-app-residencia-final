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
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { regionList.map((region) => (
          <TableRow key={ region.id }>
            <TableCell>{ region.id }</TableCell>
            <TableCell>{ region.nombre }</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/regions/${ region.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/admin/regions/${ region.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/admin/regions/${ region.id }/delete`}>
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
