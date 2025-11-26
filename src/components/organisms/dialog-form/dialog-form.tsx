import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "file";
  placeholder?: string;
  validation: z.ZodType<any>;
};

export type DynamicDialogFormProps = {
  title: string;
  description?: string;
  fields: FieldConfig[];
  schema: z.ZodObject<any>;
  onSubmit: (data: any) => Promise<void> | void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
};

export function DynamicDialogForm({
  title,
  description,
  fields,
  schema,
  onSubmit,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
}: DynamicDialogFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const form = useForm({
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.type === "file" ? null : "";
      return acc;
    }, {} as Record<string, any>),
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        const result = schema.safeParse(value);
        if (!result.success) {
          console.error("Validation failed:", result.error);
          return;
        }
        await onSubmit(value);
        setOpen(false);
        form.reset();
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const renderField = (fieldConfig: FieldConfig) => {
    return (
      <form.Field
        key={fieldConfig.name}
        name={fieldConfig.name}
        validators={{
          onChange: ({ value }) => {
            const result = fieldConfig.validation.safeParse(value);
            console.log('result', result);
            if (!result.success) {
              return result.error.issues[0]?.message || "Invalid input";
            }
            return undefined;
          },
        }}
      >
        {(field) => {
          const hasError = field.state.meta.errors.length > 0;
          const errorMessage = field.state.meta.errors[0];

          return (
            <div className="space-y-2">
              <Label htmlFor={fieldConfig.name} className="text-sm font-medium">
                {fieldConfig.label}
              </Label>
              {fieldConfig.type === "textarea" ? (
                <Textarea
                  id={fieldConfig.name}
                  data-testid={`input-${fieldConfig.name}`}
                  name={field.name}
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={fieldConfig.placeholder}
                  className={`min-h-[100px] resize-none ${
                    hasError ? "border-destructive" : ""
                  }`}
                  disabled={isSubmitting}
                />
              ) : fieldConfig.type === "file" ? (
                <div className="space-y-2">
                  <div
                    className={`border-2 border-dashed rounded-md p-6 hover-elevate transition-colors ${
                      hasError ? "border-destructive" : "border-input"
                    }`}
                  >
                    <Input
                      id={fieldConfig.name}
                      data-testid={`input-${fieldConfig.name}`}
                      type="file"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.handleChange(file || null);
                      }}
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    />
                  </div>
                  {field.state.value && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {field.state.value.name}
                    </p>
                  )}
                </div>
              ) : (
                <Input
                  id={fieldConfig.name}
                  data-testid={`input-${fieldConfig.name}`}
                  type={fieldConfig.type}
                  name={field.name}
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={fieldConfig.placeholder}
                  className={hasError ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
              )}
              {hasError && (
                <p
                  className="text-xs text-destructive mt-1.5 transition-opacity duration-200"
                  data-testid={`error-${fieldConfig.name}`}
                >
                  {String(errorMessage)}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>
    );
  };

  const dialogContent = (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        {description && (
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="space-y-4">{fields.map(renderField)}</div>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            data-testid="button-cancel"
          >
            {cancelButtonText}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild data-testid="button-trigger">
          {trigger}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {dialogContent}
    </Dialog>
  );
}