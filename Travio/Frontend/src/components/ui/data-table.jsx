import {
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ArrowDownAZIcon, ArrowUpAZIcon, ArrowUpDownIcon, SearchIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function DataTable({
  columns,
  data,
  emptyMessage = 'No data found.',
  filterColumnKey,
  filterPlaceholder = 'Search...',
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filterColumn = filterColumnKey ? table.getColumn(filterColumnKey) : null;
  const visibleRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="rounded-2xl shadow-sm">
      {filterColumn && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative max-w-sm w-full">
              <SearchIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterColumn.getFilterValue() ?? ''}
                onChange={(event) => filterColumn.setFilterValue(event.target.value)}
                placeholder={filterPlaceholder}
                className="w-full h-10 rounded-xl bg-white border border-gray-600 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cde88d] focus:border-[#a8df34]"
              />
            </div>

            <span className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-full px-3 py-1 shadow-sm">
              {visibleRows} item
            </span>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();

                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-gray-600 hover:bg-slate-50 hover:text-gray-900 transition-colors"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === 'asc' && <ArrowUpAZIcon className="h-3.5 w-3.5 text-gray-500" />}
                        {sorted === 'desc' && <ArrowDownAZIcon className="h-3.5 w-3.5 text-gray-500" />}
                        {!sorted && <ArrowUpDownIcon className="h-3.5 w-3.5 text-gray-400" />}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-24 text-center text-gray-400 text-sm">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
