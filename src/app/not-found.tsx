import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 text-center border border-gray-200 shadow-lg animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-4 gap-2">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h1 className="text-2xl mt-4 font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
