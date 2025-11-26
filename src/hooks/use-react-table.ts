import { useReactTableStore } from "@/store/react-table-store";

export const useReactTableData = <TData = any>(tableName: string) => {
  const {
    tables,
    setOriginalData,
    setFilteredData,
    setSelectedRows,
    clearSelectedRows,
    setSelectedCols,
    clearSelectedCols,
    resetTable,
    resetAll,
  } = useReactTableStore();

  const table = tables[tableName] || { originalData: [], filteredData: [] };
//   console.log("useReactTableData - tables:", tables);

  return {
    originalData: table.originalData as TData[],
    filteredData: table.filteredData as TData[],
    selectedRows: table.selectedRows as TData[],
    setOriginalData: (data: TData[]) => setOriginalData(tableName, data),
    setFilteredData: (data: TData[]) => setFilteredData(tableName, data),
    setSelectedRows: (rows: TData[]) => setSelectedRows(tableName, rows),
    clearSelectedRows: () => clearSelectedRows(tableName),
    setSelectedCols: (cols: string[]) => setSelectedCols(tableName, cols),
    clearSelectedCols: () => clearSelectedCols(tableName),
    resetTable: () => resetTable(tableName),
    resetAll: () => resetAll(),
  };
};
