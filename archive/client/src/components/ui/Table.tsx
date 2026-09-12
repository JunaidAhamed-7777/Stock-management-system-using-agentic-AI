import React from "react";

export interface TableRowProps {
  cells: (string | number | React.ReactNode)[];
  onSelect?: (index: number) => void;
  isSelected?: boolean;
  index: number;
  className?: string;
}

export interface TableHeadCellProps {
  label: string;
  className?: string;
}

export interface TableProps {
  headers: string[];
  rows: any[];
  rowClassName?: (row: any, index: number) => string;
  onRowSelect?: (index: number) => void;
  stickyColumns?: number;
  className?: string;
}

export const TableHeadCell: React.FC<TableHeadCellProps> = ({
  label,
  className,
}) => {
  return (
    <th
      className="
        py-3
        px-3
        text-xs
        font-medium
        text-slate-600
        uppercase
        tracking-wider
        border-b
        border-border-default
        bg-slate-50
      "
      {...(className ? { className } : {})}
    >
      {label}
    </th>
  );
};

export const TableRow: React.FC<TableRowProps> = ({
  cells,
  onSelect,
  isSelected,
  index,
  className,
}) => {
  const rowClasses = `
    border-b
    border-border-default
    hover:bg-slate-50
    transition-colors
    ${isSelected ? "bg-primary-50" : ""}
    ${className ? ` ${className}` : ""}
  `;

  return (
    <tr className={rowClasses}>
      {cells.map((cell, i) => {
        const cellClasses = `
          py-3
          px-3
          text-sm
          text-slate-900
          ${i === cells.length - 1
            ? "text-right font-medium text-primary-600"
            : ""}
        `;

        return (
          <td
            key={i}
            className={cellClasses}
          >
            {typeof cell === "number" ? cell : cell}
          </td>
        );
      })}
      {onSelect && (
        <td
          className="
            py-3
            px-3
          "
        >
          <button
            onClick={() => onSelect(index)}
            className="
              text-xs
              font-medium
              text-primary-600
              underline
            "
          >
            Select
          </button>
        </td>
      )}
    </tr>
  );
};

export const Table: React.FC<TableProps> = ({
  headers,
  rows,
  rowClassName,
  onRowSelect,
  stickyColumns = 0,
  className,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-table">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <TableHeadCell key={i} label={header} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const classes = rowClassName
              ? rowClassName(row, i)
              : "";
            return (
              <TableRow
                key={i}
                cells={Object.values(row)}
                onSelect={onRowSelect?.(i)}
                isSelected={false}
                index={i}
                className={classes}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};