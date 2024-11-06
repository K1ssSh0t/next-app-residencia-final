import { TipoBachillereCreateForm } from "@/components/admin/tipo-bachilleres/tipo-bachillere-create-form";

export default async function Page() {

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Tipo Bachillere</h1>
      <TipoBachillereCreateForm 
      />
    </div>
  );
}
