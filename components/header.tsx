import { ModeToggle } from "@/components/mode-toggle"; import { auth } from "@/lib/auth";
import Link from
  "next/link"; export async function Header() {

    const session = await auth();

    const user = session?.user;

    return (
      <header>
        <div
          className="container mx-auto px-6 py-4 flex justify-between items-center"
        >
          <div className="flex items-center">


            <Link href="/" className="font-bold">
              {user?.email ? "Bienvenido" : "Inicia Sesion"}
            </Link>
          </div>
          <div>

            <Link href="/dashboard" className="mr-4">
              Dashboard
            </Link>
            {user?.role !== "user" ? (
              <Link href="/admin" className="mr-4">
                Admin
              </Link>
            ) : (
              <></>
            )}

            {user?.id ? (
              <Link href="/signout">
                Cerrar sesion
              </Link>
            ) : (
              <Link href="/signin">
                Iniciar sesion
              </Link>
            )}

            <div className="ml-5 inline-block">
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }