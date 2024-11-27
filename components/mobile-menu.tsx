'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'

export function MobileMenu({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="md:hidden">
            <Button
                variant="outline"
                size="icon"
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-background-alt focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
                {isOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                )}
            </Button>

            {isOpen && (
                <div className="absolute top-16 inset-x-0 z-10 p-2 transition transform origin-top-right md:hidden">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-background divide-y-2 divide-gray-50">
                        <div className="pt-5 pb-6 px-5">
                            <div className="mt-6">
                                <nav className="grid gap-y-8">
                                    {children}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

