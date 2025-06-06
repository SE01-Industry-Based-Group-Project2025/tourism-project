import React from "react";
import Sidebar from "./AdminSidebar";
import Header from "./Header";

export default function AdminLayout({children}){
    return(
        <div className="flex min-h-screen">
            <aside className="w-64 bg-blue-800 text-white">
                <Sidebar/>
            </aside>

            <div className="flex flex-1 flex-col bg-gray-100">
                <header className="sticky top-0 z-10 bg-white shadow-sm">
                    <Header/>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div> 
        
    );
}