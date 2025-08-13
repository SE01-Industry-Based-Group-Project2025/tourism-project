// src/features/admin/analytics/components/SimpleLineChart.jsx
import React from 'react';

const SimpleLineChart = ({ 
  data = [], 
  width = 400, 
  height = 200, 
  xKey = 'x', 
  yKey = 'y',
  color = '#3B82F6',
  showDots = true,
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
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const yRange = maxY - minY || 1;

  // Create path
  const pathCommands = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxY - (Number(point[yKey]) || 0)) / yRange) * chartHeight;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

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
    
    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i / 4) * chartWidth;
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + chartHeight}
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
        
        {/* Line */}
        <path
          d={pathCommands}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Dots */}
        {showDots && data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          const y = padding + ((maxY - (Number(point[yKey]) || 0)) / yRange) * chartHeight;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={4}
              fill={color}
              stroke="white"
              strokeWidth={2}
            >
              <title>{`${point[xKey]}: ${point[yKey]}`}</title>
            </circle>
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
        {data.length <= 6 && data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {String(point[xKey]).slice(-3)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default SimpleLineChart;
