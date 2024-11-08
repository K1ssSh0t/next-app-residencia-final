
'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { authenticate } from '@/actions/auth'
import { useToast } from '@/hooks/use-toast'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function Page(props: {
  searchParams: SearchParams;
}) {

  const searchParams = use(props.searchParams)

  let error: any;
  if (searchParams.error) {
    switch (searchParams.error) {
      case "unauthenticated":
        error = "Sin autenticar";
        break;
      case "unauthorized":
        error = "No autorizado";
        break;
      default:
        error = "Error de inicio de sesion";
        break;
    }
  }
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await authenticate(formData)

      if (result.success) {
        toast({
          title: 'Exito',
          description: 'Has iniciado sesion.',
          variant: 'success',
          duration: 3000,
        })
        router.push('/admin')
      } else if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
          duration: 3000,
        })
        router.push(`/admin-login/?error=${error}`);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex flex-col gap-2 items-center border rounded p-5 max-w-xs">
        <div className='text-xl font-bold text-center'>Iniciar sesion como Administrador</div>
        <form
          className="flex flex-col gap-2 items-center w-full"
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="w-full">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="password"
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesion...' : 'Iniciar sesion con Credenciales'}
          </Button>
        </form>
        <Separator className="my-4" />
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  )
}

// import { signIn } from "@/lib/auth";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { AuthError } from "next-auth";
// import { redirect } from "next/navigation";

// type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// export default async function Page(props: {
//   searchParams: SearchParams;
// }) {
//   const searchParams = await props.searchParams;

//   let error;
//   if (searchParams.error) {
//     switch (searchParams.error) {
//       case "unauthenticated":
//         error = "Unauthenticated";
//         break;
//       case "unauthorized":
//         error = "Unauthorized";
//         break;
//       default:
//         error = "Login failed";
//         break;
//     }
//   }


//   return (
//     <div className="flex min-h-screen justify-center items-center">
//       <Card>
//         <CardHeader>
//           <CardTitle>Admin Login</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form
//             key={"credentials"}
//             className="flex flex-col gap-2 items-center w-full"
//             action={async (formData: FormData) => {
//               "use server";
//               try {
//                 await signIn("credentials", {
//                   redirectTo: "/admin",
//                   email: formData.get("email"),
//                   password: formData.get("password"),
//                 });
//               } catch (error) {
//                 if (error instanceof AuthError) {
//                   return redirect(`/admin-login/?error=${error.type}`);
//                 }
//                 throw error;
//               }
//             }}
//           >
//             <div className="w-full">
//               <Label>Email</Label>
//               <Input type="text" name="email" placeholder="user@example.com" />
//             </div>
//             <div className="w-full">
//               <Label>Password</Label>
//               <Input type="password" name="password" placeholder="password" />
//             </div>
//             <Button className="w-full" type="submit">
//               <span>Sign in</span>
//             </Button>
//           </form>
//           {error && <div className="text-red-500">{error}</div>}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
