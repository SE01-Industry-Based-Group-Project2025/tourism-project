import React from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../ui/Table";
import { Button } from "../ui/Button";
import { Eye, Edit3} from "lucide-react";

export default function TourTable({ tours, onView, onEdit }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden backdrop-blur-sm">
            <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <TableRow>
                        <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                Tour Name
                            </div>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-green-100 rounded-lg">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                Duration
                            </div>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-purple-100 rounded-lg">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                Availability
                            </div>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-yellow-100 rounded-lg">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                Status
                            </div>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="p-1.5 bg-indigo-100 rounded-lg">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                </div>
                                Action
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-50">
                    {tours.map((tour) => (
                        <TableRow key={tour.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent transition-all duration-200 group">
                           <TableCell className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">{tour.title}</TableCell>
                           <TableCell className="text-gray-700">{tour.duration}</TableCell>
                            <TableCell className="text-gray-700">{tour.participants} spots</TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                        tour.status === "active"
                                        ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                                        : tour.status === "inactive"
                                        ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                                        : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                                    }`}
                                >
                                    {tour.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                                        onClick={() => onView(tour.id)}
                                    >
                                        <Eye className="w-4 h-4 mr-1.5" />
                                        View
                                        <span className="sr-only">View Tour</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-green-600 hover:text-green-800 hover:bg-green-50 border border-green-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                                        onClick={() => onEdit(tour.id)}
                                    >
                                        <Edit3 className="w-4 h-4 mr-1.5" />
                                        Edit
                                        <span className="sr-only">Edit Tour</span>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}