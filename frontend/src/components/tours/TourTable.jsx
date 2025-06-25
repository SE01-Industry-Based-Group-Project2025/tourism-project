import React from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../ui/Table";
import { Button } from "../ui/Button";
import { Eye, Edit3} from "lucide-react";

export default function TourTable({ tours, onView, onEdit }) {
    return (        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <Table>
                <TableHeader className="bg-gradient-to-r from-slate-50/80 to-blue-50/40 backdrop-blur-sm">
                    <TableRow className="border-b border-gray-100/50">
                        <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <span>Tour Name</span>
                            </div>
                        </TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span>Duration</span>
                            </div>
                        </TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <span>Availability</span>
                            </div>
                        </TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span>Status</span>
                            </div>
                        </TableHead>
                        <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider text-center">
                            <div className="flex items-center justify-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                </div>
                                <span>Actions</span>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100/50">                    {tours.map((tour) => (
                        <TableRow key={tour.id} className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-purple-50/20 transition-all duration-300 group hover:shadow-md">
                           <TableCell className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{tour.title}</TableCell>
                           <TableCell className="text-gray-700 font-medium">{tour.duration}</TableCell>
                            <TableCell className="text-gray-700 font-medium">{tour.participants} spots</TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all duration-200 ${
                                        tour.status === "active"
                                        ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-400/25"
                                        : tour.status === "inactive"
                                        ? "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-red-400/25"
                                        : "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-blue-400/25"
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
                                        className="text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border-2 border-blue-200 hover:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl font-semibold"
                                        onClick={() => onView(tour.id)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />                                        View
                                        <span className="sr-only">View Tour</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-green-600 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 border-2 border-green-200 hover:border-green-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl font-semibold"
                                        onClick={() => onEdit(tour.id)}
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
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
    );
}