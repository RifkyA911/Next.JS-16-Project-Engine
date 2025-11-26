"use client"
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DynamicDialogForm, FieldConfig } from "../organisms/dialog-form/dialog-form";

const companyFormSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    pic: z.string().min(2, "PIC must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(10, "Address must be at least 10 characters"),
    file: z.any().refine((file) => file !== null, "Please upload a file"),
});

const companyFormFields: FieldConfig[] = [
    {
        name: "companyName",
        label: "Nama Perusahaan",
        type: "text",
        placeholder: "PT. Contoh Perusahaan",
        validation: z.string().min(2, "Company name must be at least 2 characters"),
    },
    {
        name: "fullName",
        label: "Nama Lengkap",
        type: "text",
        placeholder: "John Doe",
        validation: z.string().min(2, "Full name must be at least 2 characters"),
    },
    {
        name: "pic",
        label: "PIC",
        type: "text",
        placeholder: "Person in Charge",
        validation: z.string().min(2, "PIC must be at least 2 characters"),
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "example@company.com",
        validation: z.string().email("Invalid email address"),
    },
    {
        name: "phone",
        label: "Nomor Telefon",
        type: "tel",
        placeholder: "+62 812 3456 7890",
        validation: z.string().min(10, "Phone number must be at least 10 digits"),
    },
    {
        name: "address",
        label: "Alamat Lengkap",
        type: "textarea",
        placeholder: "Jl. Contoh No. 123, Jakarta",
        validation: z.string().min(10, "Address must be at least 10 characters"),
    },
    {
        name: "file",
        label: "File Upload",
        type: "file",
        validation: z.any().refine((file) => file !== null, "Please upload a file"),
    },
];

export default function DynamicDialogFormExample() {
    const [callbackOpen, setCallbackOpen] = useState(false);
    const [submittedData, setSubmittedData] = useState<any>(null);

    const handleSubmit = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Form submitted:", data);
        setSubmittedData(data);
    };

    return (
        <div className="min-h-screen bg-background p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 rounded-lg shadow">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Dynamic Dialog Form Component Example
                    </h1>
                    <p className="text-muted-foreground">
                        Reusable form component with Zod validation and flexible trigger
                        options
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold">Example 1: Button Trigger</h2>
                        <p className="text-sm text-muted-foreground">
                            Form triggered by a custom button
                        </p>
                        <DynamicDialogForm
                            title="Company Registration Form"
                            description="Please fill in all the required information to register your company."
                            fields={companyFormFields}
                            schema={companyFormSchema}
                            onSubmit={handleSubmit}
                            trigger={
                                <Button variant="default">Open Form with Button Trigger</Button>
                            }
                        />
                    </div>

                    <div className="border-t pt-6 space-y-3">
                        <h2 className="text-xl font-semibold">
                            Example 2: Callback Function Only
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Form controlled by external state (no built-in trigger button)
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setCallbackOpen(true)}
                            data-testid="button-external-trigger"
                        >
                            Open Form with Callback Function
                        </Button>
                        <DynamicDialogForm
                            title="Company Registration Form"
                            description="Controlled via external state and callback function."
                            fields={companyFormFields}
                            schema={companyFormSchema}
                            onSubmit={handleSubmit}
                            open={callbackOpen}
                            onOpenChange={setCallbackOpen}
                        />
                    </div>

                    <div className="border-t pt-6 space-y-3">
                        <h2 className="text-xl font-semibold">Example 3: Custom Styling</h2>
                        <p className="text-sm text-muted-foreground">
                            Form with custom trigger button styling
                        </p>
                        <DynamicDialogForm
                            title="Company Registration Form"
                            description="Complete the form to proceed with registration."
                            fields={companyFormFields}
                            schema={companyFormSchema}
                            onSubmit={handleSubmit}
                            submitButtonText="Register Company"
                            cancelButtonText="Close"
                            trigger={
                                <Button variant="default" size="lg">
                                    Register New Company
                                </Button>
                            }
                        />
                    </div>
                    <div className="text-sm text-gray-500 space-y-2">
                        <p><strong>Fitur yang tersedia:</strong></p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Schema validasi dinamis dengan Zod</li>
                            <li>Error handling dengan pesan merah</li>
                            <li>File upload support</li>
                            <li>Loading state saat submit</li>
                            <li>Responsive design</li>
                            <li>TypeScript support</li>
                        </ul>
                    </div>
                    {submittedData && (
                        <div className="border-t pt-6 space-y-3">
                            <h2 className="text-xl font-semibold">Submitted Data</h2>
                            <div className="bg-muted p-4 rounded-md">
                                <pre className="text-sm overflow-x-auto">
                                    {JSON.stringify(
                                        {
                                            ...submittedData,
                                            file: submittedData.file
                                                ? {
                                                    name: submittedData.file.name,
                                                    size: submittedData.file.size,
                                                    type: submittedData.file.type,
                                                }
                                                : null,
                                        },
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}