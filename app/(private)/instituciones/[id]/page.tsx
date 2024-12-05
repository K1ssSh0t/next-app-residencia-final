import { notFound } from "next/navigation";
import { getInstitucionWithRelations } from "@/repositories/institucione-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const institucion = await getInstitucionWithRelations(id);

  if (!institucion) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Instituciones</h1>
      <div>
        <p><strong>Id:</strong> {institucion.id}</p>
        <p><strong>Nombre:</strong> {institucion.nombre}</p>
        <p><strong>Region:</strong> {institucion.region?.nombre}</p>
        <p><strong>Municipio:</strong> {institucion.municipio?.nombre}</p>
        <p><strong>Tipo Instituciones Id:</strong> {institucion.tipoInstitucionesId}</p>
        <p><strong>Tipo Bachilleres Id:</strong> {institucion.tipoBachilleresId}</p>
        <p><strong>Users Id:</strong> {institucion.usersId}</p>
        <p><strong>Nivel Educativo:</strong> {institucion.nivelEducativo ? "true" : "false"}</p>

      </div>
    </div>
  );
}
