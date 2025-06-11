import React from "react";

export function Table({ className = "", children, ...rest }) {
  return (
    <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...rest}>
      {children}
    </table>
  );
}

export function TableHeader({ className = "", children, ...rest }) {
  return (
    <thead className={className} {...rest}>
      {children}
    </thead>
  );
}

export function TableBody({ className = "", children, ...rest }) {
  return (
    <tbody className={className} {...rest}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = "", children, ...rest }) {
  return (
    <tr className={className} {...rest}>
      {children}
    </tr>
  );
}
export function TableHead({ className = "", children, ...rest }) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...rest}>
      {children}
    </th>
  );
}
export function TableCell({ className = "", children, ...rest }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`} {...rest}>
      {children}
    </td>
  );
}
