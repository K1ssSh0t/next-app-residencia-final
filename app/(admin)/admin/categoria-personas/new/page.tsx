import { CategoriaPersonaCreateForm } from "@/components/admin/categoria-personas/categoria-persona-create-form";

export default async function Page() {

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Categoria Persona</h1>
      <CategoriaPersonaCreateForm 
      />
    </div>
  );
}
