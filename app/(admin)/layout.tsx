import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/schema/users";
import { isAdmin, isConsultor, isOperador } from "@/services/authorization-service";
import { ConsultorSidebar } from "@/components/admin/consultor-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin-login?error=unauthenticated");
  }

  if (!(isConsultor(session) || isOperador(session) || isAdmin(session))) {
    redirect("/admin-login?error=unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/admin-login");
  }

  const consultor = isConsultor(session);

  return (
    <div>
      <SidebarProvider>
        {consultor ? <ConsultorSidebar user={user} /> : <AdminSidebar user={user} />}
        <main className="p-5 w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
