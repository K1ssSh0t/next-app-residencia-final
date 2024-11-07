import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

export default function Page() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex flex-col gap-2 items-center border rounded p-5 max-w-xl">
        <h5 className="text-center">¿Estas seguro que quieres cerrar sesion?</h5>
        <form
          action={async (formData) => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit">Cerrar Sesion</Button>
        </form>
      </div>
    </div>
  );
}
