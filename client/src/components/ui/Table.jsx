export function Table({ columns, rows, rowKey = "id", empty, onRowClick }) {
  const safeRows = Array.isArray(rows) ? rows : [];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead className="bg-surface-container-low">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`h-table-row-dense px-space-base font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold border-b border-outline-variant ${column.align === "right" ? "text-right" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-space-base py-space-3xl">
                {empty}
              </td>
            </tr>
          ) : (
            safeRows.map((row, index) => (
              <tr
                key={row?.[rowKey] ?? `row-${index}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`h-table-row-default border-b border-outline-variant last:border-0 hover:bg-surface ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-space-base font-body-sm text-body-sm text-on-surface ${column.align === "right" ? "text-right" : ""}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
