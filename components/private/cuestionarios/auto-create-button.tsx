'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createAutoCuestionario } from "@/actions/private/cuestionarios/create-auto-cuestionario";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AutoCreateButtonProps {
    institucionId: string;
    disabled?: boolean;
}

export function AutoCreateButton({ institucionId, disabled }: AutoCreateButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();

    const handleClick = () => {
        startTransition(async () => {
            const result = await createAutoCuestionario(institucionId);
            if (result.success) {
                toast({
                    title: "Éxito",
                    description: "Cuestionario creado correctamente",
                });
                router.refresh();
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error al crear el cuestionario",
                });
            }
        });
    };

    return (
        <Button
            className="w-full justify-start"
            variant="outline"
            size="sm"
            disabled={disabled || isPending}
            onClick={handleClick}
        >
            <PlusIcon className="mr-2 h-4 w-4" />
            Crear cuestionario {new Date().getFullYear()}
        </Button>
    );
}