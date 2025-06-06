import React from "react";


export default function Header(){
    return (
        <div className="flex items-center justify-between px-6 py-4">
            {/*Left: Title and subtitle*/}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Tour Management</h1>
                <p className="text-sm text-gray-500">Oversee and manage all tour packages.</p>
            </div>

            {/*Right: Notification bell + avatar*/}    
            <div className="flex items-center space-x-4">
                {/*Bell icon with red dot*/} 
                <button className="relative p-2-rounded rounded-full hover:bg-gray-100 focus:outline-none">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    >
                        <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                        <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
                    </svg>
                    {/*Red badge*/}
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                    </span>
                </button>
                {/*Admin Avatar + dropdown caret*/}
                <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="hidden md:flex flex-col text-left">
                        <span className="text-sm font-medium text-gray-800">Admin User</span>
                        <span className="text-xs text-gray-500">Adminstrator</span>
                    </div>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden h-4 w-4 text-gray-500 md:block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    >
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}