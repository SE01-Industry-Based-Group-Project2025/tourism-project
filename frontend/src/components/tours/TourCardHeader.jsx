import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import { PilcrowLeft, PlusIcon } from "lucide-react";

export default function TourCardHeader() {
    return (
        <Card className="rounded-lg shadow-md">
            <CardHeader className="p-0">
                <div className="flex flex-col lg:flex-row items-center justify-between p-6">
                    <CardTitle className="mb-4 lg:mb-0">Manage Tours</CardTitle>                    <Button asChild className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-lg px-6 py-2">
                        <Link to="/admin/tours/new" className="flex items-center gap-2">
                            <PlusIcon className="h-4 w-4" />
                            <span>New Tour</span>
                        </Link>
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
}
