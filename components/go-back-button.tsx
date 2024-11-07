'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function GoBackButton() {
    const router = useRouter()

    const handleGoBack = () => {
        router.back()
    }

    return (
        <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2"
        >
            <ArrowLeft className="h-4 w-4" />
            Ir atras
        </Button>
    )
}