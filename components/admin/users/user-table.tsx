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
import { Badge } from "@/components/ui/badge";
import { instituciones } from "@/schema/instituciones";
import { cuestionarios } from "@/schema/cuestionarios";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { especialidades } from "@/schema/especialidades";

type UserWithProgress = {
  id: string;
  email: string;
  role: string;
  nivelEducativo: boolean | null;
  password: string | null;
  progressStatus: 'sin empezar' | 'en progreso' | 'terminado';
};

//TODO: HACER QUE EL PROGRESO SOLO SE MUESTRE PARA USUARIOS NORMALES


export async function UserTable({ userList }: { userList: UsersWithRelations }) {

  const userProgress: UserWithProgress[] = await Promise.all(
    userList.map(async (user) => {
      const institucion = await db.select().from(instituciones).where(eq(instituciones.usersId, user.id)).limit(1);
      let progressStatus: 'sin empezar' | 'en progreso' | 'terminado' = 'sin empezar';

      if (institucion.length > 0) {
        const cuestionariosResult = await db
          .select({
            count: count(),
            firstId: sql<string>`MIN(${cuestionarios.id})`
          })
          .from(cuestionarios)
          .where(eq(cuestionarios.usersId, user.id))
          .groupBy(cuestionarios.usersId);

        if (cuestionariosResult.length > 0) {
          const cuestionariosCount = cuestionariosResult[0].count;
          const firstCuestionarioId = cuestionariosResult[0].firstId;

          let totalRequired: number;

          if (institucion[0].nivelEducativo) {
            totalRequired = institucion[0].numeroCarreras!;
          } else {
            const [especialidadesCount] = await db
              .select({ value: count() })
              .from(especialidades)
              .where(eq(especialidades.cuestionarioId, firstCuestionarioId));

            totalRequired = especialidadesCount.value;
          }

          if (cuestionariosCount === totalRequired) {
            progressStatus = 'terminado';
          } else if (cuestionariosCount > 0) {
            progressStatus = 'en progreso';
          }
        }
      }

      return {
        ...user,
        progressStatus,
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
          <TableHead>Email</TableHead>
          {/* <TableHead>Email Verified</TableHead> */}
          {/* <TableHead>Image</TableHead> */}
          <TableHead>Rol</TableHead>
          <TableHead>Nivel Educativo</TableHead>
          <TableHead>Password</TableHead>
          <TableHead>Progreso</TableHead>
          <TableHead className=" sr-only">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userProgress.map((user) => {
          const badgeColor = getProgressBadgeColor(user.progressStatus);

          return (
            <TableRow key={user.id}>
              {/* <TableCell>{user.id}</TableCell> */}
              {/* <TableCell>{user.name}</TableCell> */}
              <TableCell>{user.email}</TableCell>
              {/* <TableCell>{user.emailVerified?.toLocaleString()}</TableCell> */}
              {/* <TableCell>{user.image}</TableCell> */}
              <TableCell>{user.role == "admin" ? "Administrador" : user.role == "operador" ? "Operador" : user.role == "consultor" ? "Consultor" : "Usuario"}</TableCell>
              <TableCell>{user.role == "admin" || user.role == "operador" || user.role == "consultor" ? "No aplica" :
                user.nivelEducativo ? "Superior" : "Media Superior"}</TableCell>
              <TableCell>{user.password}</TableCell>
              <TableCell>
                <Badge className={badgeColor}>
                  {user.progressStatus}
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
