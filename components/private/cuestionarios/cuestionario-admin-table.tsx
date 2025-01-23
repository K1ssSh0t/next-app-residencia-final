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
import { CuestionariosWithRelations } from "@/repositories/cuestionario-repository";

interface Props {
    cuestionarioList: CuestionariosWithRelations;
    showEspecialidadesButton?: boolean;
    institucionId?: string;
}

export function CuestionarioTable({ cuestionarioList, showEspecialidadesButton = false, institucionId }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Año</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Nombre Revoe</TableHead>
                    <TableHead>Plan de Estudio</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead>Numero Revoe</TableHead>
                    {showEspecialidadesButton && <TableHead>Especialidades</TableHead>}
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cuestionarioList.map((cuestionario: any) => (
                    <TableRow key={cuestionario.id}>
                        <TableCell>{cuestionario.año}</TableCell>
                        <TableCell>{cuestionario.carrera?.carrera?.descripcion}</TableCell>
                        <TableCell>{cuestionario.carrera?.nombreRevoe}</TableCell>
                        <TableCell>{cuestionario.carrera?.planDeEstudio}</TableCell>
                        <TableCell>{cuestionario.carrera?.modalidad?.descripcion}</TableCell>
                        <TableCell>{cuestionario.carrera?.numeroRevoe}</TableCell>
                        {showEspecialidadesButton && (
                            <TableCell>
                                <Link href={`/admin/instituciones/${institucionId}/especialidades/${cuestionario.id}`}>
                                    <Button size="sm" variant="outline">
                                        Ver Especialidades
                                    </Button>
                                </Link>
                            </TableCell>
                        )}
                        <TableCell className="justify-end flex gap-2">
                            <Link href={`/admin/cuestionarios/${cuestionario.id}`}>
                                <Button size="icon" variant="outline">
                                    <EyeIcon />
                                </Button>
                            </Link>
                            <Link href={`/admin/carrera-institucion/${cuestionario.carrerasId}/edit`}>
                                <Button size="icon" variant="outline">
                                    <PencilIcon />
                                </Button>
                            </Link>
                            {/*
                            <Link href={`/cuestionarios/${cuestionario.id}/delete`}>
                                <Button size="icon" variant="outline">
                                    <TrashIcon />
                                </Button>
                            </Link> */}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
