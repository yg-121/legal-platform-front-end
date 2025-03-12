import type React from "react"

interface TableProps {
  children: React.ReactNode
  className?: string
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
    </div>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = "" }) => {
  return <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

export const TableBody: React.FC<TableBodyProps> = ({ children, className = "" }) => {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>
}

interface TableFooterProps {
  children: React.ReactNode
  className?: string
}

export const TableFooter: React.FC<TableFooterProps> = ({ children, className = "" }) => {
  return <tfoot className={`bg-primary-foreground font-medium text-primary ${className}`}>{children}</tfoot>
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = "" }) => {
  return (
    <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>
      {children}
    </tr>
  )
}

interface TableHeadProps {
  children: React.ReactNode
  className?: string
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className = "" }) => {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => {
  return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>
}

interface TableCaptionProps {
  children: React.ReactNode
  className?: string
}

export const TableCaption: React.FC<TableCaptionProps> = ({ children, className = "" }) => {
  return <caption className={`mt-4 text-sm text-muted-foreground ${className}`}>{children}</caption>
}

