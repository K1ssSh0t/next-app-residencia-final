import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { CheckSquareIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section>
          <div className="container flex flex-col gap-8 mt-4 mx-auto px-6 py-16 text-center rounded bg-white/80 shadow-lg border border-[#672645]/20 backdrop-blur-sm max-w-4xl">
            {/* System Title */}
            <div className="text-center">
              <div className="inline-block mb-4 px-4 py-2 rounded-full">
                <h2 className="text-3xl font-bold text-[#672645] tracking-tight">
                  SISTEMA DE CAPTURA DE INFORMACIÓN ESTADÍSTICA EDUCATIVA
                </h2>
                <h3 className="text-2xl font-semibold text-[#672645]/90 mt-2">
                  MEDIA SUPERIOR Y SUPERIOR DEL ESTADO DE OAXACA
                </h3>
              </div>
              <div className="max-w-2xl mx-auto border-t border-[#672645]/20 pt-4">
                <p className="text-gray-600 font-medium mb-3">
                  Dirección de planeación, programación y evaluación
                </p>
                <p className="text-gray-700">
                  Departamento de estadística, incorporación del tipo medio
                  superior, <br /> superior y capacitación para el trabajo
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div
            className="absolute bg-contain bg-center opacity-15 inset-0 -z-10"
            style={{
              backgroundImage: `url('/IMG00_Admin.png')`,
            }}
          ></div>
          {/* Important Notice */}
          {/* <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Importante</h3>
            <p className="text-sm text-gray-600 mb-4">
              Los datos personales son manejados bajo los términos establecidos en la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados y que se siguen en los principios y deberes establecidos en el Título Segundo de la misma ley.
            </p>
            <p className="text-sm text-gray-600">
              Para ello, la Dirección General de Planeación, Programación y Estadística Educativa cuenta con los mecanismos de seguridad y control que permiten proteger la infraestructura e información a partir de certificados de seguridad.
            </p>
          </div> */}

          <div className="text-center mt-4 text-sm text-gray-600"></div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
