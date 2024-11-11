import { HelperUpdateForm } from "@/components/admin/helpers/helper-update-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getHelperWithRelations } from "@/repositories/helper-repository";

export default async function Page() {

  //const estadoCuestionario = await getHelperWithRelations("gmplxjm015yx484shzpagt3o");

  const estadoCuestionario = await db.query.helpers.findFirst();



  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Panel de Administración</CardTitle>
          <CardDescription>Gestiona el estado del cuestionario para los helpers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-left mb-6 gap-2">
            <h2 className="text-xl font-semibold">Estado actual del cuestionario:</h2>
            <Badge variant={estadoCuestionario?.estadoCuestionario ? "success" : "destructive"}>
              {estadoCuestionario?.estadoCuestionario ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          {estadoCuestionario && (
            <HelperUpdateForm helper={estadoCuestionario} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
