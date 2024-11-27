import { ModeToggle } from "@/components/mode-toggle";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="font-bold text-foreground">
              {user?.email ? "Bienvenido" : "Inicia Sesión"}
            </Link>
          </div>
          <MobileMenu>
            <Link href="/dashboard" className="text-base font-medium text-foreground hover:text-foreground-alt">
              Dashboard
            </Link>
            {user?.role !== "user" && (
              <Link href="/admin" className="text-base font-medium text-foreground hover:text-foreground-alt">
                Admin
              </Link>
            )}
            {user?.id ? (
              <Link href="/signout" className="text-base font-medium text-foreground hover:text-foreground-alt">
                Cerrar sesión
              </Link>
            ) : (
              <Link href="/signin" className="text-base font-medium text-foreground hover:text-foreground-alt">
                Iniciar sesión
              </Link>
            )}
            <div className="mt-4">
              <ModeToggle />
            </div>
          </MobileMenu>
          <nav className="hidden md:flex space-x-10">
            <Link href="/dashboard" className="text-base font-medium text-foreground hover:text-foreground-alt">
              Dashboard
            </Link>
            {user?.role !== "user" && (
              <Link href="/admin" className="text-base font-medium text-foreground hover:text-foreground-alt">
                Admin
              </Link>
            )}
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {user?.id ? (
              <Link href="/signout" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-background bg-primary hover:bg-primary-alt">
                Cerrar sesión
              </Link>
            ) : (
              <Link href="/signin" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-background bg-primary hover:bg-primary-alt">
                Iniciar sesión
              </Link>
            )}
            <div className="ml-5">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

