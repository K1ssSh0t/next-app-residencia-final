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
import { InstitucionesWithRelations } from "@/repositories/institucione-repository";

export function InstitucioneTable({ institucioneList }: { institucioneList: InstitucionesWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Clave de Institucion</TableHead>
          <TableHead>Clave de Centro de Trabajo</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Municipio</TableHead>

          <TableHead>Tipo Instituciones</TableHead>
          <TableHead>Tipo Bachilleres</TableHead>

          <TableHead>Nivel Educativo</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {institucioneList.map((institucione) => (
          <TableRow key={institucione.id}>
            <TableCell>{institucione.user?.email}</TableCell>
            <TableCell>{institucione.claveInstitucion}</TableCell>
            <TableCell>{institucione.claveCentroTrabajo}</TableCell>
            <TableCell>{institucione.nombre}</TableCell>
            <TableCell>{institucione.region?.nombre}</TableCell>
            <TableCell>{institucione.municipio?.nombre}</TableCell>
            <TableCell>{institucione.tipoInstituciones?.descripcion}</TableCell>
            <TableCell>{!institucione.nivelEducativo ? institucione.tipoBachilleres?.descripcion : "No Aplica"}</TableCell>

            <TableCell>{institucione.nivelEducativo ? "Superior" : "Media Superior"}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/admin/instituciones/${institucione.id}`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              {/* <Link href={`/admin/instituciones/${institucione.id}/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link> */}
              {
                // <Link href={`/instituciones/${institucione.id}/delete`}>
                //   <Button size="icon" variant="outline">
                //     <TrashIcon />
                //   </Button>
                // </Link> 
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
