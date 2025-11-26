"use client";

import * as React from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash2, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
	DataTable,
	createColumn,
	createSortableColumn,
	// createFilterableColumn,
} from "@/components/organisms/@tanstack-react-table/data-table";
import { useReactTableStore } from "@/store/react-table-store";

// Sample data type
interface Product {
	id: string;
	name: string;
	category: string;
	price: number;
	stock: number;
	status: "active" | "inactive" | "discontinued";
	createdAt: string;
}

// Sample data
const baseData: Product[] = [
	{
		id: "1",
		name: "Laptop Gaming",
		category: "Electronics",
		price: 15000000,
		stock: 25,
		status: "active",
		createdAt: "2024-01-15",
	},
	{
		id: "2",
		name: "Smartphone",
		category: "Electronics",
		price: 8000000,
		stock: 50,
		status: "active",
		createdAt: "2024-01-20",
	},
	{
		id: "3",
		name: "Headphones",
		category: "Audio",
		price: 2000000,
		stock: 0,
		status: "inactive",
		createdAt: "2024-01-25",
	},
	{
		id: "4",
		name: "Keyboard Mechanical",
		category: "Accessories",
		price: 1500000,
		stock: 15,
		status: "active",
		createdAt: "2024-02-01",
	},
	{
		id: "5",
		name: "Mouse Wireless",
		category: "Accessories",
		price: 800000,
		stock: 30,
		status: "active",
		createdAt: "2024-02-05",
	},
	{
		id: "6",
		name: "Monitor 4K",
		category: "Electronics",
		price: 12000000,
		stock: 8,
		status: "active",
		createdAt: "2024-02-10",
	},
	{
		id: "7",
		name: "Webcam HD",
		category: "Accessories",
		price: 3000000,
		stock: 0,
		status: "discontinued",
		createdAt: "2024-02-15",
	},
];

const sampleData: Product[] = Array.from({ length: 10000 }, (_, i) => {
	const base = baseData[i % baseData.length];
	return {
		...base,
		id: (i + 1).toString(),
		name: `${base.name} #${i + 1}`,
		price: base.price + Math.floor(Math.random() * 500000),
		stock: Math.floor(Math.random() * 100),
		createdAt: new Date(
			2024,
			Math.floor(Math.random() * 12),
			Math.floor(Math.random() * 28) + 1
		).toISOString().split("T")[0],
	};
});

// Column definitions
const columns: ColumnDef<Product>[] = [
	// ID column
	createColumn<Product>("id", "ID", "id", ({ getValue }) => (
		<div className="font-mono text-sm">{getValue() as string}</div>
	)),

	// Name column with sorting
	createSortableColumn<Product>(
		"name",
		"Product Name",
		"name",
		({ getValue }) => (
			<div className="font-medium">{getValue() as string}</div>
		)
	),

	// Category column
	createColumn<Product>(
		"category",
		"Category",
		"category",
		({ getValue }) => (
			<Badge variant="secondary">{getValue() as string}</Badge>
		)
	),

	// Price column with sorting and formatting
	createSortableColumn<Product>("price", "Price", "price", ({ getValue }) => {
		const price = getValue() as number;
		return (
			<div className="font-medium">
				Rp {price.toLocaleString("id-ID")}
			</div>
		);
	}),

	// Stock column with sorting
	createSortableColumn<Product>("stock", "Stock", "stock", ({ getValue }) => {
		const stock = getValue() as number;
		return (
			<div
				className={cn(
					"font-medium",
					stock === 0 && "text-destructive",
					stock < 10 && stock > 0 && "text-yellow-600"
				)}
			>
				{stock}
			</div>
		);
	}),

	// Status column with badge
	createSortableColumn<Product>("status", "Status", "status", ({ getValue }) => {
		const status = getValue() as string;
		return (
			<Badge
				variant={
					status === "active"
						? "default"
						: status === "inactive"
							? "secondary"
							: "destructive"
				}
			>
				{status}
			</Badge>
		);
	}),

	// Date column with sorting
	createSortableColumn<Product>(
		"createdAt",
		"Created Date",
		"createdAt",
		({ getValue }) => {
			const date = getValue() as string;
			return (
				<div className="text-sm text-muted-foreground">
					{new Date(date).toLocaleDateString("id-ID")}
				</div>
			);
		}
	),
];

// Helper function for className
function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(" ");
}

export function DataTableExample() {
	// console.log("Rendering DataTableExample component");
	const [selectedRows, setSelectedRows] = React.useState<Row<Product>[]>([]);

	const originalData = useReactTableStore(state => state.originalData);

	// React.useEffect(() => {
	// 	console.log("Current tables state:", originalData);
	// }, [originalData]);

	React.useEffect(() => {
		const tables = useReactTableStore.getState().tables; // ambil snapshot sekali
		console.log("Current table names:", tables);
	}, []); // kosong → cuma jalan sekali

	const handleRowClick = (row: any) => {
		console.log("Row clicked:", row.original);
	};

	const handleRowAction = (action: string, row: any) => {
		console.log(`Action: ${action}`, row.original);

		switch (action) {
			case "view":
				alert(`Viewing product: ${row.original.name}`);
				break;
			case "edit":
				alert(`Editing product: ${row.original.name}`);
				break;
			case "delete":
				if (
					confirm(
						`Are you sure you want to delete ${row.original.name}?`
					)
				) {
					alert(`Deleted product: ${row.original.name}`);
				}
				break;
		}
	};

	const handleRowSelectionChange = (rows: Row<Product>[]) => {
		setSelectedRows(rows);
		console.log("Selected rows:", rows);
	};

	return (
		<div className="container mx-auto py-10">
			<div className="space-y-4">
				<div>
					<h1 className="text-3xl font-bold">Data Table Example</h1>
					<p className="text-muted-foreground">
						A comprehensive example of the reusable data table
						component with all features.
					</p>
				</div>

				{/* Basic Data Table */}
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold">Basic Data Table</h2>
					<DataTable
						tableName="productsTable_1"
						columns={columns}
						data={sampleData}
						searchKey={["name", "category"]}
						searchPlaceholder="Search products..."
						enableRowSelection={true}
						enableColumnVisibility={true}
						enableSorting={true}
						enableFiltering={true}
						enablePagination={true}
						pageSize={5}
						// loading={true}
						onRowClick={handleRowClick}
						onRowSelectionChange={handleRowSelectionChange}
						onRowAction={handleRowAction}
						rowActions={[
							{
								label: "View Details",
								value: "view",
								icon: <Eye className="h-4 w-4" />,
							},
							{
								label: "Edit Product",
								value: "edit",
								icon: <Edit className="h-4 w-4" />,
							},
							{
								label: "Delete Product",
								value: "delete",
								icon: <Trash2 className="h-4 w-4" />,
								variant: "destructive",
							},
						]}
						emptyMessage="No products found."
						striped={true}
						hoverable={true}
						stickyHeader={true}
					/>
				</div>

				{/* Selected Rows Info */}
				{selectedRows.length > 0 && (
					<div className="rounded-lg border p-4">
						<h3 className="font-semibold mb-2">
							Selected Products ({selectedRows.length})
						</h3>
						<div className="space-y-1">
							{selectedRows.map((product) => (
								<div key={product.id} className="text-sm">
									{product.original.name} - Rp{" "}
									{product.original.price.toLocaleString("id-ID")}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Advanced Configuration Example */}
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold">
						Advanced Configuration
					</h2>
					<DataTable
						tableName="productsTable_2"
						columns={columns}
						data={sampleData}
						searchKey="category"
						searchPlaceholder="Search by category..."
						enableRowSelection={false}
						enableColumnVisibility={false}
						enableSorting={true}
						enableFiltering={true}
						enablePagination={true}
						pageSize={3}
						className="border-2 border-primary/20 p-4"
						emptyMessage="No products in this category."
						striped={false}
						hoverable={true}
					/>
				</div>

				{/* Minimal Configuration Example */}
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold">
						Minimal Configuration
					</h2>
					<DataTable
						tableName="productsTable_3"
						columns={columns.slice(0, 4)} // Only first 4 columns
						data={sampleData.slice(0, 3)} // Only first 3 rows
						enableRowSelection={false}
						enableColumnVisibility={false}
						enableSorting={false}
						enableFiltering={false}
						enablePagination={false}
						striped={true}
						hoverable={false}
					/>
				</div>
			</div>
		</div>
	);
}

export default DataTableExample;
