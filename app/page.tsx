import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { CheckSquareIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Header />

      <section >
        <div className="container flex flex-col gap-8 mx-auto px-6 py-16 text-center p-5 rounded" >

          {/* System Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-[#672645] mb-2">Sistema Integral de Informacion</h2>
            <p className="text-gray-600">
              Dirección General de Planeación,<br />
              Programación y Estadística Educativa
            </p>
          </div>

        </div>
      </section>

      <section
      >
        <div className="absolute bg-contain bg-center opacity-15 inset-0 -z-10" style={{
          backgroundImage: `url('/IMG00_Admin.png')`
        }}></div>
        {/* Important Notice */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Importante</h3>
          <p className="text-sm text-gray-600 mb-4">
            Los datos personales son manejados bajo los términos establecidos en la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados y que se siguen en los principios y deberes establecidos en el Título Segundo de la misma ley.
          </p>
          <p className="text-sm text-gray-600">
            Para ello, la Dirección General de Planeación, Programación y Estadística Educativa cuenta con los mecanismos de seguridad y control que permiten proteger la infraestructura e información a partir de certificados de seguridad.
          </p>
        </div>

        <div className="text-center mt-4 text-sm text-gray-600">

        </div>
      </section>


      <Footer />
    </div>
  );
}