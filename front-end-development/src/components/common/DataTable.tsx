interface DataTableProps {
  title: string
  headers: string[]
  data: any[]
  onRowClick?: (item: any) => void
}

export default function DataTable({ title, headers, data, onRowClick }: DataTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              {headers.map((header, index) => (
                <th key={index} className="text-left py-2 px-4 text-sm font-medium text-gray-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={index} 
                className={`border-b hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {Object.values(item).map((value: any, cellIndex) => (
                  <td key={cellIndex} className="py-3 px-4 text-sm">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}