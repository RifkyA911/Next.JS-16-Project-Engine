'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useEffect } from "react"

// Error boundaries must be Client Components

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])
    return (
        // global-error must include html and body tags
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md border border-red-200 shadow-lg animate-fade-in">
                <CardHeader className="flex items-center space-x-2 border-b border-red-100 pb-3">
                    <AlertCircle className="text-red-500 w-6 h-6" />
                    <CardTitle className="text-red-600 text-lg font-semibold">
                        Oops! Something went wrong
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700">{error.message}</p>
                    <Button
                        variant="destructive"
                        className="w-full flex justify-center items-center gap-2 hover:scale-105 transition-transform"
                        onClick={reset}
                    >
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}