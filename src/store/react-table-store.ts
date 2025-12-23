// store/tableStore.ts
import { create } from "zustand";

interface TableState<TData = any> {
  originalData: TData[];
  filteredData: TData[];
  selectedRows: TData[];
  selectedCols: string[];
}

interface TableStore<TData = any> {
  tables: Record<string, TableState<TData>>;
  originalData: TableState<TData>[];
  filteredData: TableState<TData>[];

  // data
  setOriginalData: (tableName: string, data: TData[]) => void;
  setFilteredData: (tableName: string, data: TData[]) => void;

  // rows
  setSelectedRows: (tableName: string, rows: TData[]) => void;
  clearSelectedRows: (tableName: string) => void;

  // cols
  setSelectedCols: (tableName: string, cols: string[]) => void;
  clearSelectedCols: (tableName: string) => void;

  // reset
  resetTable: (tableName: string) => void;
  resetAll: () => void;
}

export const useReactTableStore = create<TableStore>((set) => ({
  tables: {},
  originalData: [],
  filteredData: [],

  setOriginalData: (tableName, data) =>
    set((state) => {
      const table = state.tables[tableName];
      if (table && table.originalData === data) return state; // data sama, skip update

      return {
        tables: {
          ...state.tables,
          [tableName]: {
            ...(table || {
              originalData: [],
              filteredData: [],
              selectedRows: [],
              selectedCols: [],
            }),
            originalData: data,
          },
        },
      };
    }),

  setFilteredData: (tableName, data) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableName]: {
          ...(state.tables[tableName] || {
            originalData: [],
            filteredData: [],
            selectedRows: [],
            selectedCols: [],
          }),
          filteredData: data,
        },
      },
    })),

  setSelectedRows: (tableName, rows) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableName]: {
          ...(state.tables[tableName] || {
            originalData: [],
            filteredData: [],
            selectedRows: [],
            selectedCols: [],
          }),
          selectedRows: rows,
        },
      },
    })),

  clearSelectedRows: (tableName) =>
    set((state) => {
      if (!state.tables[tableName]) return state;
      return {
        tables: {
          ...state.tables,
          [tableName]: {
            ...state.tables[tableName],
            selectedRows: [],
          },
        },
      };
    }),

  setSelectedCols: (tableName, cols) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableName]: {
          ...(state.tables[tableName] || {
            originalData: [],
            filteredData: [],
            selectedRows: [],
            selectedCols: [],
          }),
          selectedCols: cols,
        },
      },
    })),

  clearSelectedCols: (tableName) =>
    set((state) => {
      if (!state.tables[tableName]) return state;
      return {
        tables: {
          ...state.tables,
          [tableName]: {
            ...state.tables[tableName],
            selectedCols: [],
          },
        },
      };
    }),

  resetTable: (tableName) =>
    set((state) => {
      const table = state.tables[tableName];
      if (!table) return state;

      return {
        tables: {
          ...state.tables,
          [tableName]: {
            ...table,
            filteredData: table.originalData,
            selectedRows: [],
            selectedCols: [],
          },
        },
      };
    }),

  resetAll: () => set({ tables: {} }),
}));
