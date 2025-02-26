"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavBar() {
    const pathname = usePathname()

    return (
        <nav className="flex h-16 items-center border-b bg-background px-4">
            <div className="flex gap-6">
                <Link
                    href="/admin/consultas"
                    className={cn(
                        "text-sm font-medium transition-colors",
                        pathname === "/admin/consultas"
                            ? "text-white  border-b-2 border-primary bg-primary pb-1 rounded-sm p-2"
                            : "text-muted-foreground hover:bg-gray-200 border border-gray-300 rounded-md p-2"
                    )}
                >
                    Buscar Superior
                </Link>
                <Link
                    href="/admin/consultas/medio-superior"
                    className={cn(
                        "text-sm font-medium transition-colors",
                        pathname === "/admin/consultas/medio-superior"
                            ? "text-white border-b-2 border-primary pb- bg-primary pb-1 rounded-sm p-2"
                            : "text-muted-foreground hover:bg-gray-200 border border-gray-300 rounded-md p-2"
                    )}
                >
                    Buscar Medio Superior
                </Link>
            </div>
        </nav>
    )
}

