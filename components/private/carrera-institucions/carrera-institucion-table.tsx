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
import { CarreraInstitucionsWithRelations } from "@/repositories/carrera-institucion-repository";

export function CarreraInstitucionTable({ carreraInstitucionList }: { carreraInstitucionList: CarreraInstitucionsWithRelations }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Instituciones</TableHead>
          <TableHead>Carreras</TableHead>
          <TableHead>Nombre Revoe</TableHead>
          <TableHead>Plan De Estudio</TableHead>
          <TableHead>Modalidades</TableHead>
          <TableHead>Numero Revoe</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {carreraInstitucionList.map((carreraInstitucion) => (
          <TableRow key={carreraInstitucion.id}>
            <TableCell>{carreraInstitucion.id}</TableCell>
            <TableCell>{carreraInstitucion.institucionesId}</TableCell>
            <TableCell>{carreraInstitucion.carrerasId}</TableCell>
            <TableCell>{carreraInstitucion.nombreRevoe}</TableCell>
            <TableCell>{carreraInstitucion.planDeEstudio}</TableCell>
            <TableCell>{carreraInstitucion.modalidadesId}</TableCell>
            <TableCell>{carreraInstitucion.numeroRevoe}</TableCell>
            <TableCell className="justify-end flex gap-2">
              {/* [CODE_MARK table-actions] */}
              <Link href={`/carrera-instituciones/${carreraInstitucion.id}`}>
                <Button size="icon" variant="outline">
                  <EyeIcon />
                </Button>
              </Link>
              <Link href={`/carrera-instituciones/${carreraInstitucion.id}/edit`}>
                <Button size="icon" variant="outline">
                  <PencilIcon />
                </Button>
              </Link>
              <Link href={`/carrera-instituciones/${carreraInstitucion.id}/delete`}>
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
