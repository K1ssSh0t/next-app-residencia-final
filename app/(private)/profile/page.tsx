import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Profile</h1>
      <div>Email: {session?.user?.email}</div>
      <div>Name: {session?.user?.name}</div>
      <div>Role: {session?.user?.role}</div>

      <div>Id: {JSON.stringify(session?.user)}</div>

    </div>
  );
}
