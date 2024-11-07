'use client'
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
import { PreguntasWithRelations } from "@/repositories/pregunta-repository";
import { usePathname } from "next/navigation";

export function PreguntaTable({ preguntaList }: { preguntaList: PreguntasWithRelations }) {
    const pathname = usePathname();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Categoria Personas</TableHead>
                    <TableHead>Cuestionarios</TableHead>
                    <TableHead>Cantidad Mujeres</TableHead>
                    <TableHead>Cantidad Hombres</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {preguntaList.map((pregunta: any) => (
                    <TableRow key={pregunta.id}>
                        <TableCell>{pregunta.id}</TableCell>
                        <TableCell>{pregunta.categoriaPersona.descripcion}</TableCell>
                        <TableCell>{pregunta.cuestionariosId}</TableCell>
                        <TableCell>{pregunta.cantidadMujeres}</TableCell>
                        <TableCell>{pregunta.cantidadHombres}</TableCell>
                        <TableCell className="justify-end flex gap-2">
                            {/* [CODE_MARK table-actions] */}
                            <Link href={`${pathname}/${pregunta.id}`}>
                                <Button size="icon" variant="outline">
                                    <EyeIcon />
                                </Button>
                            </Link>
                            <Link href={`${pathname}/${pregunta.id}/edit`}>
                                <Button size="icon" variant="outline">
                                    <PencilIcon />
                                </Button>
                            </Link>
                            <Link href={`${pathname}/${pregunta.id}/delete`}>
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
