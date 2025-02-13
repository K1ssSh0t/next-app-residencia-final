import { ContactForm } from '@/components/private/user/updateContactData'
import { auth } from '@/lib/auth';
import { getUserWithRelations } from '@/repositories/user-repository';
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Datos de Contacto',
    description: 'Página de datos de contacto',
}

export default async function Page() {
    const session = await auth();
    const usuario = await getUserWithRelations(session?.user?.id)

    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-4">Datos de Contacto</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Add your contact data content here */}
                    <p>Contenido de datos de contacto</p>
                    <ContactForm initialData={{ nombreContacto: usuario?.nombreContacto ?? undefined, correoContacto: usuario?.correoContacto ?? undefined, userid: usuario?.id ?? undefined }} />
                </div>
            </div>
        </main>
    )
}