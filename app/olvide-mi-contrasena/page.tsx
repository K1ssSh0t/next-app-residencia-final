"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                body: JSON.stringify({
                    username: formData.get('username')
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al procesar la solicitud');
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full mx-4">
                <CardHeader>
                    <CardTitle>Recuperar Contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Nombre de Usuario</Label>
                            <Input
                                type="text"
                                id="username"
                                name="username"
                                min={3}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Procesando...' : 'Recuperar Contraseña'}
                        </Button>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert>
                                <AlertDescription>Mensaje Enviado. El Administrador a sido notificado.</AlertDescription>
                            </Alert>
                        )}
                    </form>
                    <div className="mt-4 text-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
                            Volver al inicio
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}