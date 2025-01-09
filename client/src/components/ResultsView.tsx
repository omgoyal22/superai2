import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pagination } from './Pagination';

interface ResultsViewProps {
  data: any[] | null;
  sqlQuery: string | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function ResultsView({ data, sqlQuery }: ResultsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChart, setSelectedChart] = useState('line');
  const itemsPerPage = 10;

  console.log('Received data:', data);
  console.log('Generated SQL Query:', sqlQuery);

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-white">No results to display.</p>
      </div>
    );
  }

  // Convert BigInt to regular numbers for display and charting
  const processedData = data.map(row => {
    const processedRow: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      processedRow[key] = typeof value === 'bigint' ? Number(value) : value;
    }
    return processedRow;
  });

  const columns = Object.keys(processedData[0]);
  const numericColumns = columns.filter(col =>
    typeof processedData[0][col] === 'number'
  );

  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'line':
        return (
          <LineChart width={800} height={400} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={columns[0]} />
            <YAxis />
            <Tooltip />
            <Legend />
            {numericColumns.map((col, i) => (
              <Line key={col} type="monotone" dataKey={col} stroke={COLORS[i % COLORS.length]} />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart width={800} height={400} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={columns[0]} />
            <YAxis />
            <Tooltip />
            <Legend />
            {numericColumns.map((col, i) => (
              <Bar key={col} dataKey={col} fill={COLORS[i % COLORS.length]} />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart width={800} height={400} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={columns[0]} />
            <YAxis />
            <Tooltip />
            <Legend />
            {numericColumns.map((col, i) => (
              <Area key={col} type="monotone" dataKey={col} fill={COLORS[i % COLORS.length]} stroke={COLORS[i % COLORS.length]} />
            ))}
          </AreaChart>
        );
      case 'scatter':
        return (
          <ScatterChart width={800} height={400}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={numericColumns[0]} name={numericColumns[0]} />
            <YAxis dataKey={numericColumns[1]} name={numericColumns[1]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Data Points" data={processedData} fill="#8884d8" />
          </ScatterChart>
        );
      case 'pie':
        return (
          <PieChart width={800} height={400}>
            <Pie
              data={processedData}
              cx={400}
              cy={200}
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey={numericColumns[0]}
              nameKey={columns[0]}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {sqlQuery && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Generated SQL Query:</h3>
          <pre className="text-white overflow-x-auto">{sqlQuery}</pre>
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-2 text-left text-gray-400">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, i) => (
              <tr key={i} className="border-t border-gray-700">
                {columns.map(col => (
                  <td key={col} className="px-4 py-2 text-white">{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {numericColumns.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Data Visualization</h3>
          <div className="mb-4">
            <label htmlFor="chart-type" className="block text-sm font-medium text-gray-400 mb-2">
              Select Chart Type:
            </label>
            <select
              id="chart-type"
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
              <option value="scatter">Scatter Plot</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={400}>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}