// src/features/admin/analytics/components/SimpleDonutChart.jsx
import React from 'react';

const SimpleDonutChart = ({ 
  data = [], 
  size = 200, 
  thickness = 40,
  labelKey = 'label',
  valueKey = 'value',
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  showLegend = true,
  className = ''
}) => {
  if (!data.length) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-500 text-sm">No data available</span>
      </div>
    );
  }

  const center = size / 2;
  const radius = (size - thickness) / 2;
  const innerRadius = radius - thickness;

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + (Number(item[valueKey]) || 0), 0);
  
  if (total === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-500 text-sm">No data available</span>
      </div>
    );
  }

  // Generate paths
  let cumulativeAngle = 0;
  const paths = data.map((item, index) => {
    const value = Number(item[valueKey]) || 0;
    const percentage = value / total;
    const angle = percentage * 2 * Math.PI;
    
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    
    // Calculate path coordinates
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    
    const x3 = center + innerRadius * Math.cos(endAngle);
    const y3 = center + innerRadius * Math.sin(endAngle);
    const x4 = center + innerRadius * Math.cos(startAngle);
    const y4 = center + innerRadius * Math.sin(startAngle);
    
    const largeArc = angle > Math.PI ? 1 : 0;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');
    
    cumulativeAngle += angle;
    
    return {
      path: pathData,
      color: colors[index % colors.length],
      label: item[labelKey],
      value: value,
      percentage: (percentage * 100).toFixed(1)
    };
  });

  return (
    <div className={className}>
      <div className="flex flex-col items-center">
        {/* Chart */}
        <svg width={size} height={size} className="mb-4">
          {paths.map((item, index) => (
            <path
              key={index}
              d={item.path}
              fill={item.color}
              className="hover:opacity-80 cursor-pointer"
            >
              <title>{`${item.label}: ${item.value.toLocaleString()} (${item.percentage}%)`}</title>
            </path>
          ))}
          
          {/* Center text */}
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            className="text-lg font-bold fill-gray-900"
          >
            {total.toLocaleString()}
          </text>
          <text
            x={center}
            y={center + 15}
            textAnchor="middle"
            className="text-sm fill-gray-600"
          >
            Total
          </text>
        </svg>
        
        {/* Legend */}
        {showLegend && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {paths.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-700 truncate">
                  {item.label}: {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleDonutChart;
