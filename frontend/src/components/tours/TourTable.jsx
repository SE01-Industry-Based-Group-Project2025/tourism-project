import React from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../ui/Table";
import { Button } from "../ui/Button";
import { Eye, Edit3} from "lucide-react";

export default function TourTable({ tours, onView, onEdit }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">  
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead>Tour Name</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tours.map((tour) => (
                        <TableRow key={tour.id} className="hover:bg-gray-50">
                           <TableCell className="font-medium text-gray-800">{tour.title}</TableCell>
                           <TableCell>{tour.duration}</TableCell>
                            <TableCell>{tour.participants} spots</TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold 
                                    ${
                                        tour.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : tour.status === "inactive"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                    {tour.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 hover:text-blue-800 mr-2"
                                    onClick={() => onView(tour.id)}
                                >
                                    <Eye className="w-4 h-4" />
                                    <span className="sr-only">View Tour</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => onEdit(tour.id)}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span className="sr-only">Edit Tour</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}