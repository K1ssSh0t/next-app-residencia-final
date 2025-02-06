import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriaPersonasWithRelations } from "@/repositories/categoria-persona-repository";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface QuestionnairePreviewProps {
    categoriaPersonaList: CategoriaPersonasWithRelations;
    level: 'superior' | 'medioSuperior';
}

export function QuestionnairePreview({ categoriaPersonaList, level }: QuestionnairePreviewProps) {
    const filteredCategories = categoriaPersonaList.filter(cat =>
        (cat.nivelAplicado === level || cat.nivelAplicado === 'ambos') && cat.activo
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Vista Previa {level === 'superior' ? 'Superior' : 'Media Superior'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Cuestionario {level === 'superior' ? 'Superior' : 'Media Superior'}
                    </DialogTitle>
                </DialogHeader>
                <div className=" grid gap-4 grid-cols-2 place-content-start">
                    {filteredCategories.map((categoria, index) => (
                        <Card key={categoria.id} className="h-[200px]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">
                                    {index + 1}. {categoria.descripcion}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label className="text-sm">Hombres</Label>
                                    <Input
                                        type="number"
                                        placeholder="Cantidad de hombres"
                                        min="0"
                                        className="h-8"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-sm">Mujeres</Label>
                                    <Input
                                        type="number"
                                        placeholder="Cantidad de mujeres"
                                        min="0"
                                        className="h-8"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
