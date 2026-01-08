import DataTableExample from "@/components/examples/data-table-example";
import DynamicDialogFormExample from "@/components/examples/dialog-form-example";
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const metadata = {
  title: "Home",
  description: "Explore interactive examples including data tables and dynamic dialog forms built with Next.js and modern UI components.",
  keywords: ["data table", "dialog form", "examples", "Next.js", "UI components"],
  openGraph: {
    title: "Interactive Examples | Next.JS Project Engine",
    description: "Explore interactive examples including data tables and dynamic dialog forms.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="container mx-auto p-4 max-w-[1440px]">
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="dialog-form">Dialog Form</TabsTrigger>
        </TabsList>
        <TabsContent value="dialog-form">
          <Card>
            <CardContent className="grid gap-6">
              <DynamicDialogFormExample />

            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table">
          <Card>
            {/* <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader> */}
            <CardContent className="grid gap-6">
              <DataTableExample />

            </CardContent>
            {/* <CardFooter>
              <Button>Save password</Button>
            </CardFooter> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

