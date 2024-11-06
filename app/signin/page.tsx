import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex flex-col gap-2 items-center border rounded p-5 max-w-xs">
        <div>Sign In</div>

            <form
              key={"credentials"}
              className="flex flex-col gap-2 items-center w-full"
              action={async (formData: FormData) => {
                "use server";
                try {
                  await signIn("credentials", {
                    redirectTo: "/dashboard",
                    email: formData.get("email"),
                    password: formData.get("password"),
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/signin/?error=${error.type}`);
                  }
                  throw error;
                }
              }}
            >
              <div className="w-full">
                <Label>Email</Label>
                <Input
                  type="text"
                  name="email"
                  placeholder="user@example.com"
                />
              </div>
              <div className="w-full">
                <Label>Password</Label>
                <Input type="password" name="password" placeholder="password" />
              </div>
              <Button className="w-full" type="submit">
                <span>Sign in with Credentials</span>
              </Button>
            </form>
            <Separator className="my-4" />
        {searchParams.error && (
          <div className="text-red-500">Login failed</div>
        )}
      </div>
    </div>
  );
}
