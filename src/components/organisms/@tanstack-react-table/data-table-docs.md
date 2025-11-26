# Data Table Component Documentation

## Overview

The `DataTable` component is a comprehensive, reusable data table built on top of shadcn/ui and TanStack Table. It provides all the features from the shadcn documentation with additional enhancements for better usability and customization.

## Features

### Core Features

-   ✅ **Sorting** - Click column headers to sort data
-   ✅ **Filtering** - Search through data with customizable search keys
-   ✅ **Pagination** - Navigate through large datasets
-   ✅ **Row Selection** - Select single or multiple rows with checkboxes
-   ✅ **Column Visibility** - Show/hide columns dynamically
-   ✅ **Row Actions** - Dropdown menu with custom actions per row
-   ✅ **Loading States** - Built-in loading indicator
-   ✅ **Empty States** - Customizable empty state messages

### Visual Enhancements

-   ✅ **Striped Rows** - Alternating row colors for better readability
-   ✅ **Hover Effects** - Row hover states for better UX
-   ✅ **Sticky Headers** - Keep headers visible while scrolling
-   ✅ **Responsive Design** - Mobile-friendly table layout
-   ✅ **Custom Styling** - Full control over appearance

## Installation

The component uses existing dependencies that are already installed in your project:

-   `@tanstack/react-table` - For table functionality
-   `@radix-ui/react-*` - For UI components
-   `lucide-react` - For icons

## Basic Usage

```tsx
import { DataTable, createColumn } from "@/components/ui/data-table";

// Define your data type
interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

// Define columns
const columns = [
	createColumn<User>("id", "ID", "id"),
	createColumn<User>("name", "Name", "name"),
	createColumn<User>("email", "Email", "email"),
	createColumn<User>("role", "Role", "role"),
];

// Use the component
function MyComponent() {
	const data: User[] = [
		{ id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
		{
			id: "2",
			name: "Jane Smith",
			email: "jane@example.com",
			role: "User",
		},
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			searchKey="name"
			searchPlaceholder="Search users..."
		/>
	);
}
```

## Props

| Prop                     | Type                                        | Default               | Description                             |
| ------------------------ | ------------------------------------------- | --------------------- | --------------------------------------- |
| `columns`                | `ColumnDef<TData, TValue>[]`                | -                     | **Required.** Column definitions        |
| `data`                   | `TData[]`                                   | -                     | **Required.** Data array to display     |
| `searchKey`              | `string`                                    | -                     | Key to search in (enables search input) |
| `searchPlaceholder`      | `string`                                    | `"Search..."`         | Placeholder text for search input       |
| `enableRowSelection`     | `boolean`                                   | `true`                | Enable row selection checkboxes         |
| `enableColumnVisibility` | `boolean`                                   | `true`                | Enable column visibility toggle         |
| `enableSorting`          | `boolean`                                   | `true`                | Enable column sorting                   |
| `enableFiltering`        | `boolean`                                   | `true`                | Enable data filtering                   |
| `enablePagination`       | `boolean`                                   | `true`                | Enable pagination                       |
| `pageSize`               | `number`                                    | `10`                  | Number of rows per page                 |
| `className`              | `string`                                    | -                     | Additional CSS classes                  |
| `onRowClick`             | `(row: Row<TData>) => void`                 | -                     | Callback when row is clicked            |
| `onRowSelectionChange`   | `(rows: Row<TData>[]) => void`              | -                     | Callback when selection changes         |
| `onRowAction`            | `(action: string, row: Row<TData>) => void` | -                     | Callback for row actions                |
| `rowActions`             | `RowAction[]`                               | `[]`                  | Array of action items for dropdown      |
| `emptyMessage`           | `string`                                    | `"No results found."` | Message when no data                    |
| `loading`                | `boolean`                                   | `false`               | Show loading state                      |
| `stickyHeader`           | `boolean`                                   | `false`               | Make header sticky                      |
| `striped`                | `boolean`                                   | `false`               | Alternate row colors                    |
| `hoverable`              | `boolean`                                   | `true`                | Enable row hover effects                |

## Column Creation Utilities

### Basic Column

```tsx
import { createColumn } from "@/components/ui/data-table";

const column = createColumn<User>(
	"id", // Column ID
	"User ID", // Header text
	"id", // Data accessor key
	({ getValue }) => <span>{getValue()}</span>, // Custom cell renderer
	{
		// Additional options
		enableSorting: true,
		enableHiding: false,
	}
);
```

### Sortable Column

```tsx
import { createSortableColumn } from "@/components/ui/data-table";

const sortableColumn = createSortableColumn<User>(
	"name",
	"Full Name",
	"name",
	({ getValue }) => <strong>{getValue()}</strong>
);
```

### Filterable Column

```tsx
import { createFilterableColumn } from "@/components/ui/data-table";

const filterableColumn = createFilterableColumn<User>(
	"email",
	"Email Address",
	"email",
	({ getValue }) => <a href={`mailto:${getValue()}`}>{getValue()}</a>,
	"includesString" // Filter function
);
```

## Advanced Examples

### With Row Actions

```tsx
const columns = [
	createColumn<User>("id", "ID", "id"),
	createColumn<User>("name", "Name", "name"),
	// ... other columns
];

function UserTable() {
	const handleRowAction = (action: string, row: any) => {
		switch (action) {
			case "edit":
				editUser(row.original);
				break;
			case "delete":
				deleteUser(row.original.id);
				break;
		}
	};

	return (
		<DataTable
			columns={columns}
			data={users}
			onRowAction={handleRowAction}
			rowActions={[
				{
					label: "Edit",
					value: "edit",
					icon: <Edit className="h-4 w-4" />,
				},
				{
					label: "Delete",
					value: "delete",
					icon: <Trash2 className="h-4 w-4" />,
					variant: "destructive",
				},
			]}
		/>
	);
}
```

### With Row Selection

```tsx
function UserTable() {
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

	const handleSelectionChange = (rows: User[]) => {
		setSelectedUsers(rows);
		console.log("Selected users:", rows);
	};

	return (
		<DataTable
			columns={columns}
			data={users}
			enableRowSelection={true}
			onRowSelectionChange={handleSelectionChange}
		/>
	);
}
```

### Custom Cell Rendering

```tsx
const columns = [
	createColumn<User>("status", "Status", "status", ({ getValue }) => {
		const status = getValue() as string;
		return (
			<Badge variant={status === "active" ? "default" : "secondary"}>
				{status}
			</Badge>
		);
	}),
	createColumn<User>("createdAt", "Created", "createdAt", ({ getValue }) => {
		const date = getValue() as string;
		return (
			<div className="text-sm text-muted-foreground">
				{new Date(date).toLocaleDateString()}
			</div>
		);
	}),
];
```

### Loading State

```tsx
function UserTable() {
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		fetchUsers().then((data) => {
			setUsers(data);
			setLoading(false);
		});
	}, []);

	return (
		<DataTable
			columns={columns}
			data={users}
			loading={loading}
			emptyMessage="No users found."
		/>
	);
}
```

## Styling Customization

### Custom CSS Classes

```tsx
<DataTable
	columns={columns}
	data={data}
	className="border-2 border-primary/20 rounded-lg"
/>
```

### Theme Integration

The component automatically integrates with your shadcn/ui theme and respects:

-   Light/Dark mode
-   Custom color schemes
-   Typography settings
-   Spacing and sizing

## Performance Considerations

### Large Datasets

For large datasets (>1000 rows), consider:

-   Using server-side pagination
-   Implementing virtual scrolling
-   Debouncing search inputs
-   Memoizing column definitions

### Optimization Tips

```tsx
// Memoize columns to prevent re-renders
const columns = useMemo(
	() => [
		createColumn<User>("id", "ID", "id"),
		createColumn<User>("name", "Name", "name"),
	],
	[]
);

// Memoize data if it comes from props
const memoizedData = useMemo(() => data, [data]);
```

## Accessibility

The component includes built-in accessibility features:

-   ARIA labels for screen readers
-   Keyboard navigation support
-   Focus management
-   Semantic HTML structure
-   Color contrast compliance

## Browser Support

-   Chrome 88+
-   Firefox 85+
-   Safari 14+
-   Edge 88+

## Troubleshooting

### Common Issues

1. **Columns not rendering**

    - Check that `accessorKey` matches your data properties
    - Ensure data is not empty or undefined

2. **Sorting not working**

    - Verify `enableSorting` is true
    - Check that `accessorKey` is properly set

3. **Search not working**

    - Ensure `searchKey` matches a column's `accessorKey`
    - Check that `enableFiltering` is true

4. **Row actions not showing**
    - Verify `rowActions` array is not empty
    - Check that `onRowAction` callback is provided

### Debug Mode

Add `console.log` statements to track data flow:

```tsx
console.log("Columns:", columns);
console.log("Data:", data);
console.log("Selected rows:", selectedRows);
```

## Examples

See `src/components/examples/data-table-example.tsx` for comprehensive usage examples including:

-   Basic table setup
-   Advanced configurations
-   Custom cell renderers
-   Row actions and selection
-   Loading and empty states
-   Different styling options
