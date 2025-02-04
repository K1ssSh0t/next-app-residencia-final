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
import { UsersWithRelations } from "@/repositories/user-repository";
import { InstitucionWithRelations } from "@/repositories/optener-institucion-query";
import { Badge } from "@/components/ui/badge";
import { instituciones } from "@/schema/instituciones";
import { cuestionarios } from "@/schema/cuestionarios";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { especialidades } from "@/schema/especialidades";
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { categoriaPersonas } from "@/schema/categoria-personas";
import { preguntas } from "@/schema/preguntas";

type UserWithProgress = {
  id: string;
  email: string;
  role: string;
  nivelEducativo: boolean | null;
  password: string | null;
  correoContacto: string | null;
  nombreContacto: string | null;
  progressStatus: 'sin empezar' | 'en progreso' | 'terminado';
  institucion: any | null;
};


export async function UserTable({ userList }: { userList: UsersWithRelations }) {
  const currentYear = new Date().getFullYear();

  // Obtener todas las categorías de personas una sola vez
  const allCategorias = await db
    .select()
    .from(categoriaPersonas);

  const userProgress: UserWithProgress[] = await Promise.all(
    userList.map(async (user) => {
      const institucion = await db.select().from(instituciones).where(eq(instituciones.usersId, user.id)).limit(1);
      const instituciondata = await db.query.instituciones.findFirst({
        where: eq(instituciones.usersId, user.id),
        with: {
          tipoBachilleres: true,
        }
      }
      );
      let progressStatus: 'sin empezar' | 'en progreso' | 'terminado' = 'sin empezar';

      if (institucion.length > 0) {
        const hasDatosInstitucionales = await db
          .select({ count: count() })
          .from(datosInstitucionales)
          .where(
            sql`${datosInstitucionales.institucionesId} = ${institucion[0].id} AND ${datosInstitucionales.anio} = ${currentYear}`
          );

        if (hasDatosInstitucionales[0].count === 0) {
          progressStatus = 'sin empezar';
        } else {
          // Determinar nivel y categorías aplicables
          const nivelInstitucional = institucion[0].nivelEducativo ? 'superior' : 'medioSuperior';
          const categoriasAplicables = allCategorias.filter(cat =>
            cat.nivelAplicado === nivelInstitucional || cat.nivelAplicado === 'ambos'
          );

          const cuestionariosResult = await db
            .select({
              id: cuestionarios.id,
            })
            .from(cuestionarios)
            .where(
              sql`${cuestionarios.usersId} = ${user.id} AND EXTRACT(YEAR FROM ${cuestionarios.createdAt}) = ${currentYear}`
            );

          if (cuestionariosResult.length > 0) {
            if (nivelInstitucional === 'medioSuperior') {
              // Para medio superior: verificar un solo cuestionario con preguntas y especialidades
              if (cuestionariosResult.length === 1) {
                const cuestionarioId = cuestionariosResult[0].id;

                // Verificar preguntas
                const preguntasCount = await db
                  .select({ count: count() })
                  .from(preguntas)
                  .where(eq(preguntas.cuestionariosId, cuestionarioId));

                // Solo verificar especialidades si no es bachiller general
                const tieneTodasLasPreguntas = preguntasCount[0].count === categoriasAplicables.length;
                let tieneEspecialidadesCompletas = true;

                if (instituciondata?.tipoBachilleres?.descripcion !== 'General') {
                  // Verificar especialidades solo si no es bachiller general
                  const especialidadesCount = await db
                    .select({ count: count() })
                    .from(especialidades)
                    .where(eq(especialidades.cuestionarioId, cuestionarioId));

                  tieneEspecialidadesCompletas = especialidadesCount[0].count === institucion[0].numeroCarreras;
                }

                if (tieneTodasLasPreguntas && tieneEspecialidadesCompletas) {
                  progressStatus = 'terminado';
                } else if (preguntasCount[0].count > 0) {
                  progressStatus = 'en progreso';
                }
              } else if (cuestionariosResult.length > 1) {
                progressStatus = 'en progreso';
              }
            } else {
              // Para superior: verificar que haya un cuestionario completo por cada carrera
              const totalCarreras = institucion[0].numeroCarreras;

              // Primero verificamos si tiene al menos un cuestionario (en progreso)
              if (cuestionariosResult.length > 0) {
                // Verificar si todos los cuestionarios están completos
                const cuestionariosCompletos = await Promise.all(
                  cuestionariosResult.map(async (cuest) => {
                    const preguntasCount = await db
                      .select({ count: count() })
                      .from(preguntas)
                      .where(eq(preguntas.cuestionariosId, cuest.id));

                    return preguntasCount[0].count === categoriasAplicables.length;
                  })
                );

                const cuestionariosTerminados = cuestionariosCompletos.filter(Boolean).length;

                if (cuestionariosTerminados === totalCarreras) {
                  progressStatus = 'terminado';
                } else {
                  progressStatus = 'en progreso';
                }
              }
            }
          }
        }
      }

      return {
        ...user,
        progressStatus,
        institucion: institucion[0],
      };
    })
  );

  const getProgressBadgeColor = (status: string) => {
    switch (status) {
      case 'sin empezar':
        return 'bg-red-100 text-red-800';
      case 'en progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead>Id</TableHead> */}
          {/* <TableHead>Name</TableHead> */}
          <TableHead>Nombre de Usuario</TableHead>
          {/* <TableHead>Email Verified</TableHead> */}
          {/* <TableHead>Image</TableHead> */}
          <TableHead>Rol</TableHead>
          <TableHead>Institución</TableHead>
          <TableHead>Nivel Educativo</TableHead>
          {/* <TableHead>Password</TableHead> */}
          <TableHead>Correo de Contacto</TableHead>
          <TableHead>Nombre del Responsable</TableHead>
          <TableHead>Progreso</TableHead>
          <TableHead className=" sr-only">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userProgress.map((user) => {
          const badgeColor = getProgressBadgeColor(user.role == "admin" || user.role == "operador" || user.role == "consultor" ? "no aplica" : user.progressStatus);

          return (
            <TableRow key={user.id}>
              {/* <TableCell>{user.id}</TableCell> */}
              {/* <TableCell>{user.name}</TableCell> */}
              <TableCell>{user.email}</TableCell>
              {/* <TableCell>{user.emailVerified?.toLocaleString()}</TableCell> */}
              {/* <TableCell>{user.image}</TableCell> */}
              <TableCell>{user.role == "admin" ? "Administrador" : user.role == "operador" ? "Operador" : user.role == "consultor" ? "Consultor" : "Usuario"}</TableCell>
              <TableCell>{user.role == "admin" || user.role == "operador" || user.role == "consultor" ? "No aplica" : user.institucion?.nombre}</TableCell>
              <TableCell>{user.role == "admin" || user.role == "operador" || user.role == "consultor" ? "No aplica" :
                user.nivelEducativo ? "Superior" : "Media Superior"}</TableCell>
              {/* <TableCell>{user.password}</TableCell> */}
              <TableCell>
                {user.correoContacto}
              </TableCell>
              <TableCell>
                {user.nombreContacto}
              </TableCell>
              <TableCell>
                <Badge className={badgeColor}>
                  {user.role == "admin" || user.role == "operador" || user.role == "consultor" ? "No aplica" :
                    user.progressStatus}
                </Badge>
              </TableCell>
              <TableCell className="justify-end flex gap-2">
                {/* [CODE_MARK table-actions] */}
                <Link href={`/admin/users/${user.id}`} title="Ver Detalles">
                  <Button size="icon" variant="outline" aria-label="Ver Detalles">
                    <EyeIcon />
                  </Button>
                </Link>
                <Link href={`/admin/users/${user.id}/edit`}>
                  <Button size="icon" variant="outline" title="Editar">
                    <PencilIcon />
                  </Button>
                </Link>
                <Link href={`/admin/users/${user.id}/delete`}>
                  <Button size="icon" variant="outline" title="Eliminar">
                    <TrashIcon />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}
