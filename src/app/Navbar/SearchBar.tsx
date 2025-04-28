"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;

        if (name) {
            router.push(`/${name}`);
        }
        setIsOpen(false); // Close the search bar after submission
    };

    return (
        <div className="relative flex items-center">
            {/* Search Icon (always visible) */}
            <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                <SearchIcon className="text-black w-6 h-6" />
            </button>

            {/* Search Bar (slides in/out) */}
            <form
                onSubmit={handleSearch}
                className={`absolute left-10 top-1/2 transform -translate-y-1/2 flex items-center justify-between gap-2 bg-gray-100 text-black p-2 rounded-md transition-all duration-300 ease-in-out ${isOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"
                    }`}
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Search"
                    className="flex-1 bg-transparent outline-none text-black"
                    autoFocus={isOpen}
                />
                <button type="submit" className="cursor-pointer">
                    <SearchIcon className="w-5 h-5 text-gray-600" />
                </button>
            </form>
        </div>
    );
};

export default SearchBar;