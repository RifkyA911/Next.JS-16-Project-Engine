# 🚀 Next.JS 16 Project Engine
### *The Ultimate Data Management Foundation*

This project is not just a standard Next.js application. It is a powerful "Engine" designed to handle complex data manipulation with high performance, a premium UI, and seamless flexibility between **Client-Side** and **Server-Side** operations.

---

## ✨ Key Features

- **🛡️ Master of Data Tables**: A highly powerful DataTable component based on TanStack Table v8.
- **🔄 Hybrid Pagination**: Switch from Client-side to Server-side pagination with just a single prop.
- **🧠 Zustand State Engine**: Centralized synchronization of table states (filters, sorting, selections).
- **🔍 Deep Search**: Intelligent debounced search supporting global queries across the entire dataset.
- **🎨 Premium UI/UX**: Modern aesthetics using Shadcn UI with smooth animations.
- **🏗️ Developer Friendly**: Helper functions like `createSortableColumn` to accelerate development.

---

## 🛠️ Technology Stack

| Core | State & Logic | UI & Animation |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | **Zustand** | **Tailwind CSS** |
| **TypeScript** | **TanStack Table v8** | **Shadcn UI** |
| **Bun Runtime** | **Use-Debounce** | **Lucide Icons** |

---

## 🚀 The Star Component: `DataTable`

The `DataTable` component is the heart of this project. It is engineered to handle thousands of rows with zero lag.

### 🔌 Basic Usage (Client-Side)

Simply pass your data array and let the engine handle the rest.

```tsx
import { DataTable, createColumn } from "@/components/organisms/data-table";

const columns = [
  createColumn("name", "Product Name"),
  createColumn("price", "Price", undefined, ({ getValue }) => `$${getValue()}`),
];

// Inside your component
<DataTable 
  tableName="myProducts" 
  columns={columns} 
  data={myData} 
  enablePagination 
/>
```

### 🌍 Server-Side Mode (Enterprise Ready)

Need to handle millions of rows from an API? Activate server-side mode by providing `queryOptions`.

```tsx
<DataTable
  tableName="serverSideTable"
  columns={columns}
  data={apiData} // Data fetched per page
  queryOptions={{
    page: 1,
    limit: 10,
    lastPage: 100,
    totalPage: 1000
  }}
  onPageChange={(page) => fetchData(page)}
  onSearchChange={(query) => handleSearch(query)}
/>
```

---

## 💡 Tutorial: Creating a New Page

1. **Define Columns**: Use `createColumn` or `createSortableColumn` outside the component for optimal performance.
2. **Setup State**: If using server-side mode, use `useState` to store your data and query options.
3. **Fetch Data**: Use a `useEffect` that reacts to page or search query changes.
4. **Render**: Pass the state into the `<DataTable />` component.

> [!TIP]
> Use `autoResetPageIndex: false` if you want the table data to update (e.g., periodic refreshes) without forcing the user back to the first page.

---

## 🧠 State Management (Zustand)

Each table maintains its own state within a global store. You can access filtered data or selected rows from any component:

```tsx
const selectedRows = useReactTableStore(state => state.tables["myTable"]?.selectedRows);
```

---

## 🔧 Installation

Clone this project and run the following commands:

```bash
# Using Bun (Highly recommended)
bun install
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) for the Dashboard, and [http://localhost:3000/example](http://localhost:3000/example) to see the Server-Side Pagination demo in action!

---

## 🤝 Contribution

This project is open for improvements. If you find a bug or want to propose a new feature, feel free to open an Issue or submit a Pull Request.

**Happy Coding! 💻🔥**
