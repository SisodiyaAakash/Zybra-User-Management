"use client";

import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

function GradientLoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-full animate-spin border-t-4 border-blue-500"></div>
        <div className="absolute h-12 w-12 rounded-full animate-spin border-t-4 border-red-500 border-opacity-75"></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // Fetch data using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    },
  });

  // Define columns using `createColumnHelper`
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("username", {
      header: "Username",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor(
      (row) =>
        `${row.address.street}, ${row.address.suite}, ${row.address.city}, ${row.address.zipcode}`,
      {
        id: "address",
        header: "Address",
        cell: (info) => info.getValue(),
      }
    ),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("website", {
      header: "Website",
      cell: (info) => (
        <a href={`http://${info.getValue()}`} target="_blank" rel="noreferrer">
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor((row) => row.company.name, {
      id: "company",
      header: "Company",
      cell: (info) => info.getValue(),
    }),
  ];

  // Set up the table instance
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Adjust page size

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newState = updater(table.getState());
      setPageIndex(newState.pagination.pageIndex);
      setPageSize(newState.pagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return <GradientLoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Zybra User Management Dashboard
      </h1>
      <div className="relative mb-4">
        <input
          type="text"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search users..."
          className="w-full p-3 pl-10 border rounded-lg shadow-shadow1 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.9 14.32a8 8 0 111.41-1.41l4.3 4.29a1 1 0 11-1.42 1.42l-4.3-4.3zM8 14a6 6 0 100-12 6 6 0 000 12z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gradient-to-r from-gray-200 to-gray-400 text-black dark:from-gray-800 dark:to-gray-900 dark:text-white"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="border px-4 py-3 text-left text-sm font-semibold uppercase cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header()
                          : header.column.columnDef.header}
                      </span>
                      <span className="min-w-4 min-h-4">
                        {header.column.getIsSorted() === "asc"
                          ? "🔼"
                          : header.column.getIsSorted() === "desc"
                          ? "🔽"
                          : ""}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`${
                  rowIndex % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-700"
                    : "bg-white dark:bg-slate-800"
                } hover:bg-blue-100 dark:hover:bg-black`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-4 py-3 text-sm">
                    {cell.renderValue()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
          disabled={pageIndex === 0}
          className="bg-[#2086BF] hover:bg-transparent text-white hover:text-[#2086BF] border-[#2086BF] disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
        >
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() =>
            setPageIndex((old) =>
              old < table.getPageCount() - 1 ? old + 1 : old
            )
          }
          disabled={pageIndex === table.getPageCount() - 1}
          className="bg-[#2086BF] hover:bg-transparent text-white hover:text-[#2086BF] border-[#2086BF] disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
