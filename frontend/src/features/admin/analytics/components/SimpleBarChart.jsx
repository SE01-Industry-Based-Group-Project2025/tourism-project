// src/features/admin/analytics/components/SimpleBarChart.jsx
import React from 'react';

const SimpleBarChart = ({ 
  data = [], 
  width = 400, 
  height = 200, 
  xKey = 'x', 
  yKey = 'y',
  color = '#3B82F6',
  showGrid = true,
  className = ''
}) => {
  if (!data.length) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ width, height }}>
        <span className="text-gray-500 text-sm">No data available</span>
      </div>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Get min/max values
  const yValues = data.map(d => Number(d[yKey]) || 0);
  const maxY = Math.max(...yValues);
  const minY = Math.min(0, Math.min(...yValues));
  const yRange = maxY - minY || 1;

  // Bar dimensions
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;

  // Grid lines
  const gridLines = [];
  if (showGrid) {
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i / 4) * chartHeight;
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={padding + chartWidth}
          y2={y}
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      );
    }
  }

  return (
    <div className={className}>
      <svg width={width} height={height} className="border border-gray-200 rounded-lg bg-white">
        {/* Grid */}
        {gridLines}
        
        {/* Bars */}
        {data.map((point, index) => {
          const value = Number(point[yKey]) || 0;
          const barHeight = Math.abs(value / yRange) * chartHeight;
          const x = padding + (index / data.length) * chartWidth + barSpacing / 2;
          const y = value >= 0 
            ? padding + ((maxY - value) / yRange) * chartHeight
            : padding + ((maxY - 0) / yRange) * chartHeight;
          
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx={2}
              className="hover:opacity-80 cursor-pointer"
            >
              <title>{`${point[xKey]}: ${value.toLocaleString()}`}</title>
            </rect>
          );
        })}
        
        {/* Y-axis labels */}
        <text x={15} y={padding} textAnchor="middle" className="text-xs fill-gray-600">
          {maxY.toLocaleString()}
        </text>
        <text x={15} y={padding + chartHeight} textAnchor="middle" className="text-xs fill-gray-600">
          {minY.toLocaleString()}
        </text>
        
        {/* X-axis labels */}
        {data.length <= 8 && data.map((point, index) => {
          const x = padding + (index / data.length) * chartWidth + (chartWidth / data.length) / 2;
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {String(point[xKey]).length > 10 
                ? String(point[xKey]).slice(0, 10) + '...'
                : String(point[xKey])
              }
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default SimpleBarChart;
