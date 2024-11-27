import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t bg-[#672645] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/placeholder.svg?height=100&width=200"
              alt="Gobierno de México"
              width={200}
              height={100}
              className="mb-4"
            />
          </div>
          <div>
            <h4 className="font-bold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:underline">Participa</Link></li>
              <li><Link href="#" className="hover:underline">Publicaciones Oficiales</Link></li>
              <li><Link href="#" className="hover:underline">Marco Jurídico</Link></li>
              <li><Link href="#" className="hover:underline">Plataforma Nacional de Transparencia</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">¿Qué es gob.mx?</h4>
            <p className="text-sm mb-4">
              Es el portal único de trámites, información y participación ciudadana.
            </p>
            <Link href="#" className="text-sm hover:underline">Leer más</Link>
          </div>
          <div>
            <h4 className="font-bold mb-4">Síguenos en</h4>
            <div className="flex gap-4">
              <Link href="#" className="hover:opacity-80">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="hover:opacity-80">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}