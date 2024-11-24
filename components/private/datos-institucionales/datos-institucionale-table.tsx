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
import { DatosInstitucionalesWithRelations } from "@/repositories/datos-institucionale-repository";

export function DatosInstitucionaleTable({ datosInstitucionaleList }: { datosInstitucionaleList: DatosInstitucionalesWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Instituciones</TableHead>
          <TableHead>Categorias Generales</TableHead>
          <TableHead>Cantidad Hombres</TableHead>
          <TableHead>Cantidad Mujeres</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { datosInstitucionaleList.map((datosInstitucionale) => (
          <TableRow key={ datosInstitucionale.id }>
            <TableCell>{ datosInstitucionale.id }</TableCell>
            <TableCell>{ datosInstitucionale.institucionesId }</TableCell>
            <TableCell>{ datosInstitucionale.categoriasGeneralesId }</TableCell>
            <TableCell>{ datosInstitucionale.cantidadHombres }</TableCell>
            <TableCell>{ datosInstitucionale.cantidadMujeres }</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/datos-institucionales/${ datosInstitucionale.id }`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/datos-institucionales/${ datosInstitucionale.id }/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/datos-institucionales/${ datosInstitucionale.id }/delete`}>
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
