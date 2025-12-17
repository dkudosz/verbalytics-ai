import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ReactNode } from "react";

type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
};

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function GenericTable<T>({ columns, data, emptyMessage = "No data available." }: GenericTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={String(col.key)} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={String(col.key)} className={col.className}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

