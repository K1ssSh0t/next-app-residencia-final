import { notFound } from "next/navigation";
import { getInstitucioneWithRelations } from "@/repositories/institucione-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;

    const institucion = await getInstitucioneWithRelations(id);

    if (!institucion) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-6">Instituciones</h1>
            <div>
                <p><strong>Id:</strong> {institucion.id}</p>
                <p><strong>Nombre:</strong> {institucion.nombre}</p>
                <p><strong>Region:</strong> {institucion.region}</p>
                <p><strong>Municipio:</strong> {institucion.municipio}</p>
                <p><strong>Tipo Instituciones Id:</strong> {institucion.tipoInstituciones?.descripcion}</p>
                <p><strong>Tipo Bachilleres Id:</strong> {institucion.tipoBachilleres?.descripcion}</p>
                <p><strong>Users Id:</strong> {institucion.usersId}</p>
                <p><strong>Nivel Educativo:</strong> {institucion.nivelEducativo ? "Superior" : "Media Superior"}</p>
            </div>
        </div>
    );
}
