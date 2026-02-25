"use client";

import * as React from "react";
import { useDebounce } from "use-debounce";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	Row,
	RowSelectionState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useReactTableData } from "@/hooks/use-react-table";
import ReactTableSkeleton from "../../loaders/react-table";
import { DataTableQuery, DataTableToolbarAction, ToolbarAnchor } from "@/types/tanstack-table";
// import { debounce } from "@/utils/async";

interface DataTableProps<TData, TValue> {
	tableName?: string; // for zustand table store
	className?: string;
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pageSize?: number; // default: 10
	pageOptionSize?: number[]; // default: [10, 20, 30, 40, 50]
	searchKey?: keyof TData | Array<keyof TData>;
	searchPlaceholder?: string;
	toolbarActions?: DataTableToolbarAction<TData>[];
	enableRowSelection?: boolean;
	enableColumnVisibility?: boolean;
	enableSorting?: boolean;
	enableSearch?: boolean;
	enablePagination?: boolean;
	// ----- Server/Client pagination -----
	// paginationMode?: PaginationMode; 		// default: "client"
	// totalRows?: number; 					// ⚠️ required if paginationMode="server"
	// onFetchData?: (params: {				// ⚠️ required if paginationMode="server"
	// 	limit: number;						// -- current page size
	// 	offset: number;						// -- current offset
	// 	total: number;						// -- current page total count size
	// 	search: string;
	// 	sortBy: string;
	// 	sortOrder: "asc" | "desc" | null;
	// }) => void;
	queryOptions?: DataTableQuery;
	onPreviousPage?: () => void;
	onNextPage?: () => void;
	onPageChange?: (page: number) => void;
	onSearchChange?: (search: string) => void;
	// -----------------------------------
	onRowClick?: (row: Row<TData>) => void;
	onRowSelectionChange?: (selectedRows: Row<TData>[]) => void;
	onRowAction?: (action: string, row: Row<TData>) => void;
	rowActions?: Array<{
		label: string;
		value: string;
		icon?: React.ReactNode;
		variant?: "default" | "destructive";
	}>;
	emptyMessage?: string;
	isLoading?: boolean;
	isStickyHeader?: boolean;
	isStriped?: boolean;
	isHoverable?: boolean;
	loadingComponent?: React.ReactNode;
}

export function DataTable<TData, TValue>({
	className,
	tableName = "default", // default table name for zustand
	columns,
	data,
	searchKey,
	pageSize = 10,
	pageOptionSize = [10, 20, 30, 40, 50],
	searchPlaceholder = "Search...",
	toolbarActions = [],
	enableRowSelection = true,
	enableColumnVisibility = true,
	enableSorting = true,
	enableSearch = true,
	enablePagination = true,
	// paginationMode = "client",
	// totalRows, 						// ⚠️ required if paginationMode="server"
	// onFetchData,					// ⚠️ required if paginationMode="server"
	queryOptions,
	onPreviousPage,
	onNextPage,
	onPageChange,
	onSearchChange,
	onRowClick,
	onRowSelectionChange,
	onRowAction,
	rowActions = [],
	emptyMessage = "No results found.",
	isLoading = false,
	isStickyHeader = false,
	isStriped = false,
	isHoverable = true,
	loadingComponent = undefined
}: DataTableProps<TData, TValue>) {
	const [globalSearch, setGlobalSearch] = React.useState("");
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
		{}
	);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: pageSize,
	});

	// Sync pageSize prop to internal state if it changes
	React.useEffect(() => {
		setPagination(prev => ({ ...prev, pageSize }));
	}, [pageSize]);

	const isServerSide: boolean = !!queryOptions;

	const [debouncedSearch] = useDebounce(globalSearch, 500);

	//zustand init
	const {
		//   originalData, 
		filteredData: filteredDataZustand,
		setOriginalData,
		setFilteredData,
		setSelectedRows,
		//   clearSelectedRows,
		//   setSelectedCols,
		//   clearSelectedCols,
	} = useReactTableData(tableName);

	// memoize data reference; use simple dependency to satisfy react-hooks rule
	// const memoData = React.useMemo(() => data, [JSON.stringify(data)]);
	const memoData = React.useMemo(() => data, [data]);

	const isInvalid =
		!memoData ||
		memoData.length === 0 ||
		!tableName ||
		tableName === "default" ||
		tableName.trim() === "";

	// simpan original
	React.useEffect(() => {
		// console.log(tableName, 'first', isInvalid, memoData)
		if (isInvalid) return;
		setOriginalData(memoData);
		setFilteredData(memoData);
	}, [isInvalid, memoData]);

	// normalize searchKey jadi array of keys (keyof TData)
	const searchKeys = React.useMemo(() => {
		if (!searchKey) return [] as Array<keyof TData>;
		return Array.isArray(searchKey) ? searchKey : [searchKey];
	}, [searchKey]);

	// filteredData: client-side OR search across the searchKeys
	const filteredData = React.useMemo(() => {
		if (isServerSide) return data; // server handles filtering, just pass data

		const q = debouncedSearch.trim().toLowerCase();
		if (!q) return data;

		if (searchKeys.length === 0) {
			// kalau tidak ada searchKey, fallback: cari di semua field (opsional)
			return data.filter((row) =>
				Object.values(row as Record<string, unknown>).some((v) =>
					v !== undefined && String(v).toLowerCase().includes(q)
				)
			);
		}

		const result = data.filter((row) =>
			searchKeys.some((key) => {
				const value = (row as any)[String(key)];
				return value !== undefined && String(value).toLowerCase().includes(q);
			})
		);

		return result;
	}, [data, debouncedSearch, searchKeys, isServerSide]);

	// Trigger server-side search only when query actually changes
	React.useEffect(() => {
		if (isServerSide) {
			onSearchChange?.(debouncedSearch);
		}
	}, [debouncedSearch, isServerSide]);

	// Handle client-side filtering and page reset
	React.useEffect(() => {
		if (!isServerSide) {
			// Client side: Reset to first page when search changes
			setPagination(prev => ({ ...prev, pageIndex: 0 }));
			setFilteredData(filteredData);
		}
	}, [filteredData, isServerSide]);

	// React.useEffect(() => {
	// 	console.log('filteredZustand', filteredDataZustand)
	// }, [filteredDataZustand]);

	// Enhanced columns with row selection and actions
	const enhancedColumns = React.useMemo(() => {
		const cols: ColumnDef<TData, TValue>[] = [];

		// Add row selection column if enabled
		if (enableRowSelection) {
			cols.push({
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() &&
								"indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				),
				enableSorting: false,
				enableHiding: false,
			});
		}

		// Add original columns
		cols.push(...columns);

		// Add actions column if row actions are provided
		if (rowActions.length > 0) {
			cols.push({
				id: "actions",
				enableHiding: false,
				cell: ({ row }) => {
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{rowActions.map((action) => (
									<DropdownMenuItem
										key={action.value}
										onClick={() =>
											onRowAction?.(action.value, row)
										}
										className={cn(
											action.variant === "destructive" &&
											"text-destructive"
										)}
									>
										{action.icon && (
											<span className="mr-2">
												{action.icon}
											</span>
										)}
										{action.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			});
		}

		return cols;
	}, [columns, enableRowSelection, rowActions, onRowAction]);

	const renderToolbarActions = (anchor: ToolbarAnchor) =>
		toolbarActions
			.filter(action => action.anchor === anchor)
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
			.map(action => (
				<React.Fragment key={action.id}>
					{typeof action.render === "function"
						? action.render({
							tableName,
							selectedRows,
							clearSelection: () =>
								table.toggleAllPageRowsSelected(false),
						})
						: action.render}
				</React.Fragment>
			))


	const table = useReactTable({
		data: filteredDataZustand, // ?? filteredData,
		columns: enhancedColumns,
		// ===== MODE SWITCH =====
		manualPagination: isServerSide,
		manualSorting: isServerSide,
		manualFiltering: isServerSide,
		pageCount: isServerSide
			? queryOptions?.lastPage
			: undefined,
		// ===== ROW MODELS =====
		getCoreRowModel: getCoreRowModel(),
		...(isServerSide
			? {}
			: {
				getPaginationRowModel: getPaginationRowModel(),
				getSortedRowModel: getSortedRowModel(),
				getFilteredRowModel: getFilteredRowModel(),
			}),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		// ===== STATE =====
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: isServerSide
				? {
					pageIndex: Math.max((queryOptions?.page ?? 1) - 1, 0),
					pageSize: queryOptions?.limit ?? 10,
				}
				: pagination,
		},

		// ===== SERVER PAGE CHANGE =====
		onPaginationChange: (updater) => {
			const oldPagination = isServerSide
				? {
					pageIndex: Math.max((queryOptions?.page ?? 1) - 1, 0),
					pageSize: queryOptions?.limit ?? 10,
				}
				: pagination;

			const nextPagination =
				typeof updater === "function"
					? updater(oldPagination)
					: updater;

			if (isServerSide) {
				onPageChange?.(nextPagination.pageIndex + 1);
			} else {
				setPagination(nextPagination);
			}
		},
		initialState: {
			pagination: {
				pageSize,
			},
		},
		enableSorting,
		enableFilters: enableSearch,
		autoResetPageIndex: false,
	});

	// Debugging logs
	console.log(`[DataTable:${tableName}] isServerSide:`, isServerSide);
	console.log(`[DataTable:${tableName}] Table Pagination State:`, table.getState().pagination);
	console.log(`[DataTable:${tableName}] Raw Data count:`, data.length);
	console.log(`[DataTable:${tableName}] Filtered Data count (Zustand):`, filteredDataZustand.length);
	console.log(`[DataTable:${tableName}] Page Count:`, table.getPageCount());
	console.log(`[DataTable:${tableName}] Can Next:`, table.getCanNextPage());
	console.log(`[DataTable:${tableName}] Can Prev:`, table.getCanPreviousPage());

	// Handle row selection changes
	React.useEffect(() => {
		if (isInvalid) return;

		if (onRowSelectionChange) {
			const selectedRows = table.getFilteredSelectedRowModel().rows;
			setSelectedRows(selectedRows); //zustand
			onRowSelectionChange(selectedRows);
		}
	}, [rowSelection, onRowSelectionChange, table]);

	const selectedRows = table.getFilteredSelectedRowModel().rows;

	// const debouncedGoToPage = React.useMemo(
	// 	() =>
	// 		debounce((page: number) => {
	// 			table.setPageIndex(page); // - 1); karena UI 1-based
	// 		}, 0.5),
	// 	[table]
	// );

	if (isLoading) {
		if (loadingComponent) {
			return <>{loadingComponent}</>;
		}
		return <ReactTableSkeleton columns={columns.length} rows={5} />;
	}

	if (isInvalid) {
		console.error(
			'DataTable: tableName is not set. Using "default" may cause data collision if multiple tables are used.'
		);
		return (
			<div className="text-red-500">
				Error: tableName is required and cannot be default or empty.
			</div>
		);
	}

	return (
		<div className={cn("space-y-4", className)}>
			{/* Toolbar */}
			<div className="flex items-center justify-between">
				<div className="flex flex-1 items-center space-x-2">
					{/* Search */}
					{/* {enableSearch && searchKey && (
						<Input
							placeholder={searchPlaceholder}
							value={
								(table
									.getColumn(searchKey)
									?.getFilterValue() as string) ?? ""
							}
							onChange={(event) =>
								table
									.getColumn(searchKey)
									?.setFilterValue(event.target.value)
							}
							className="h-8 w-[150px] lg:w-[250px]"
						/>
					)} */}
					{renderToolbarActions("left")}
					{enableSearch && (
						<Input
							placeholder={searchPlaceholder}
							value={globalSearch}
							onChange={(event) => setGlobalSearch(event.target.value)}
							className="h-8 w-[150px] lg:w-[250px]"
						/>
					)}
					{renderToolbarActions("after-search")}

					{/* Selected rows info */}
					{enableRowSelection && selectedRows.length > 0 && (
						<div className="text-sm text-muted-foreground">
							{selectedRows.length} of{" "}
							{table.getFilteredRowModel().rows.length} row(s)
							selected.
						</div>
					)}
				</div>

				<div className="flex items-center space-x-2">
					{renderToolbarActions("after-columns")}
					{/* Column visibility */}
					{enableColumnVisibility && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Columns <ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
					{renderToolbarActions("right")}
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader
						className={cn(
							isStickyHeader && "sticky top-0 z-1 bg-background"
						)}
					>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={enhancedColumns.length}
									className="h-24 text-center"
								>
									<div className="flex items-center justify-center">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
										<span className="ml-2">isLoading...</span>
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, index) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
									className={cn(
										isStriped &&
										index % 2 === 1 &&
										"bg-muted/25",
										isHoverable && "hover:bg-muted/50",
										onRowClick && "cursor-pointer"
									)}
									onClick={() => onRowClick?.(row)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={enhancedColumns.length}
									className="h-24 text-center"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{enablePagination && (
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						Showing{" "}
						{table.getState().pagination.pageIndex *
							table.getState().pagination.pageSize +
							1}{" "}
						to{" "}
						{Math.min(
							(table.getState().pagination.pageIndex + 1) *
							table.getState().pagination.pageSize,
							table.getFilteredRowModel().rows.length
						)}{" "}
						of {table.getFilteredRowModel().rows.length} entries
					</div>
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium">Rows per page</p>
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
							className="h-8 w-[70px] rounded border border-input bg-background px-2 text-sm"
						>
							{pageOptionSize.map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									{pageSize}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								onPreviousPage?.();
								if (isServerSide) {
									onPageChange?.(queryOptions!.page - 1);
								} else {
									table.previousPage();
								}
							}}
							disabled={isServerSide
								? queryOptions!.page <= 1
								: !table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<div className="flex items-center space-x-1">
							<span className="text-sm font-medium">
								Page
								<Input
									type="text"
									className="w-14 mx-2 text-center h-8"
									min={1}
									max={isServerSide ? queryOptions?.lastPage : table.getPageCount()}
									value={isServerSide
										? queryOptions!.page
										: table.getState().pagination.pageIndex + 1}
									onChange={(e) => {
										const val = e.target.value ? Number(e.target.value) : 0;
										if (isNaN(val)) return;

										if (isServerSide) {
											onPageChange?.(
												Math.min(Math.max(val, 1), queryOptions!.lastPage)
											);
										} else {
											table.setPageIndex(
												Math.min(Math.max(val - 1, 0), table.getPageCount() - 1)
											);
										}
									}}
								/>
								of {' '}
								{isServerSide ? queryOptions?.lastPage : table.getPageCount()}
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								onNextPage?.();
								if (isServerSide) {
									onPageChange?.(queryOptions!.page + 1);
								} else {
									table.nextPage();
								}
							}}
							disabled={isServerSide
								? queryOptions!.page >= queryOptions!.lastPage
								: !table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

// Utility function to create column definitions
export function createColumn<TData>(
	id: string,
	header: string,
	accessorKey?: keyof TData,
	cell?: (props: any) => React.ReactNode,
	options?: Partial<ColumnDef<TData>>
): ColumnDef<TData> {
	return {
		id,
		accessorKey: accessorKey as string,
		header,
		cell: cell || (({ getValue }) => getValue()),
		...options,
	};
}

// Utility function for sorting columns
export function createSortableColumn<TData>(
	id: string,
	header: string,
	accessorKey?: keyof TData,
	cell?: (props: any) => React.ReactNode,
	options?: Partial<ColumnDef<TData>>
): ColumnDef<TData> {
	return {
		id,
		accessorKey: accessorKey as string,
		header: ({ column }) => {
			const sort = column.getIsSorted(); // 'asc' | 'desc' | false

			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(sort === "asc")}
					className="h-8 px-2 lg:px-3 flex items-center cursor-pointer select-none"
					aria-label={`Sort by ${header}`}
				>
					<span className="flex items-center">
						<span>{header}</span>

						{sort === "asc" ? (
							<ChevronUp className="ml-2 h-4 w-4 text-primary" />
						) : sort === "desc" ? (
							<ChevronDown className="ml-2 h-4 w-4 text-primary" />
						) : (
							// unsorted: muted/down icon
							<ChevronDown className="ml-2 h-4 w-4 opacity-50" />
						)}
					</span>
				</Button>
			);
		},
		cell: cell || (({ getValue }) => getValue()),
		...options,
	};
}

// Utility function for filterable columns
export function createFilterableColumn<TData>(
	id: string,
	header: string,
	accessorKey?: keyof TData,
	cell?: (props: any) => React.ReactNode,
	filterFn?: any,
	options?: Partial<ColumnDef<TData>>
): ColumnDef<TData> {
	return {
		id,
		accessorKey: accessorKey as string,
		header,
		cell: cell || (({ getValue }) => getValue()),
		filterFn,
		...options,
	};
}

// Export types for external use
export type { DataTableProps };
