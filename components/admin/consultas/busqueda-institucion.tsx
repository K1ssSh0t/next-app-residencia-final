import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getInstitutionWithRelations, InstitucionWithRelations } from "@/repositories/optener-institucion-query";


export async function InstitutionResults({ institution }: { institution: string }) {

    // const institutionData = institution
    //     ? await (async () => {
    //         await new Promise(resolve => setTimeout(resolve, 5000));
    //         return await getInstitutionWithRelations(institution);
    //     })()
    //     : undefined;

    if (!institution) {
        return null;
    }

    const institutionData = await getInstitutionWithRelations(institution);

    await new Promise(resolve => setTimeout(resolve, 2000));


    if (!institutionData) {
        return <p className="text-center mt-6">No institution found. Please try another search.</p>;
    }

    return (

        <Card>
            <CardHeader>
                <CardTitle>{institutionData?.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="general-info">
                        <AccordionTrigger>General Information</AccordionTrigger>
                        <AccordionContent>
                            <p>Type: {institutionData?.tipoInstituciones?.descripcion}</p>
                            <p>Region: {institutionData?.region?.nombre}</p>
                            <p>Municipality: {institutionData?.municipio?.nombre}</p>
                            <p>Education Level: {institutionData?.nivelEducativo ? "Superior" : "Medio Superior"}</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="careers">
                        <AccordionTrigger>Careers</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-6">
                                {/* {institution.carreraInstituciones.map((ci) => (
                  <li key={ci.id}>
                    {ci.carrera.nombre} - {ci.modalidad.nombre}
                  </li>
                ))} */}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="institutional-data">
                        <AccordionTrigger>Institutional Data</AccordionTrigger>
                        <AccordionContent>
                            {/* {institution.datosInstitucionales.map((di) => (
                <div key={di.id} className="mb-2">
                  <p>{di.categoriasGenerales.descripcion}</p>
                  <p>Men: {di.cantidadHombres}, Women: {di.cantidadMujeres}</p>
                </div>
              ))} */}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

    );
}

