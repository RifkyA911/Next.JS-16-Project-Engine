import { Row } from "@tanstack/react-table";

export type ToolbarAnchor = // Custom Component position in toolbar

    | "left"
    // | "before-search"
    | "after-search"
    // | "before-columns"
    | "after-columns"
    | "right";

export type PaginationMode = "client" | "server";

export interface DataTableToolbarAction<TData> {
  id: string;
  anchor?: ToolbarAnchor; // default: "end"
  order?: number;
  render:
    | React.ReactNode
    | ((ctx: {
        tableName: string;
        selectedRows: Row<TData>[];
        clearSelection: () => void;
      }) => React.ReactNode);
}

export type SortOrder = "ASC" | "DESC" | "asc" | "desc" | null;
export interface DataTableQuery {
  page: number; // 1-based (UI)
  limit: number; // page size
  offset: number; // (page - 1) * limit  → DERIVED
  totalPage: number; // dari backend
  lastPage: number; // dari backend

  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface APIResponsePagination<TData> {
  data: TData[];
  meta: {
    page: number;
    limit: number;
    offset: number;
    totalPage: number;
    lastPage: number;
  };
}
