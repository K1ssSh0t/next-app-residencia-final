import { notFound } from "next/navigation";
import { getInstitucioneWithRelations } from "@/repositories/institucione-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const institucione = await getInstitucioneWithRelations(id);

  if (!institucione) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Instituciones</h1>
      <div>
        <p><strong>Id:</strong> {institucione.id}</p>
        <p><strong>Nombre:</strong> {institucione.nombre}</p>
        <p><strong>Region:</strong> {institucione.region?.nombre}</p>
        <p><strong>Municipio:</strong> {institucione.municipio?.nombre}</p>
        <p><strong>Tipo Instituciones Id:</strong> {institucione.tipoInstitucionesId}</p>
        <p><strong>Tipo Bachilleres Id:</strong> {institucione.tipoBachilleresId}</p>
        <p><strong>Users Id:</strong> {institucione.usersId}</p>
        <p><strong>Nivel Educativo:</strong> {institucione.nivelEducativo ? "true" : "false"}</p>

      </div>
    </div>
  );
}
