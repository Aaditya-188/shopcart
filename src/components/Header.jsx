import React, { useState, useContext, useEffect } from "react";
import { Context } from "../App.jsx";
import { NavLink, useNavigate } from "react-router-dom";

function Header({ navigationItems }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartCounter, setCartCounter] = useContext(Context);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let counter = 0;
        for (let x in cart) counter += cart[x].quantity;
        setCartCounter(counter);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${query}`);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">

                {/* Logo */}
                <div>
                    <a href="/">
                        <img
                            src="/logo.png"
                            className="w-[150px] h-auto object-contain"
                            alt="ShopCart Logo"
                        />
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <div className="block lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
                    >
                        <svg
                            className={`fill-current h-6 w-6 ${isOpen ? "hidden" : "block"}`}
                            viewBox="0 0 20 20"
                        >
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                        <svg
                            className={`fill-current h-6 w-6 ${isOpen ? "block" : "hidden"}`}
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Items */}
                <div className={`w-full lg:flex lg:items-center lg:w-auto mt-4 lg:mt-0 ${isOpen ? "block" : "hidden"}`}>
                    <nav className="text-sm flex flex-col lg:flex-row lg:items-center">
                        <NavLink to="/" className={({ isActive }) =>
                            isActive ? "mb-4 lg:mb-0 lg:mx-3 font-semibold" : "mb-4 lg:mb-0 lg:mx-3"}>
                            Home
                        </NavLink>

                        {navigationItems.map((item) => (
                            <NavLink
                                key={item}
                                to={item.toLowerCase()}
                                className={({ isActive }) =>
                                    isActive
                                        ? "mb-4 lg:mb-0 lg:mx-3 font-semibold"
                                        : "mb-4 lg:mb-0 lg:mx-3"
                                }
                            >
                                {item}
                            </NavLink>
                        ))}

                        {/* Mobile cart */}
                        <NavLink to="/cart" className="lg:hidden mb-4 lg:mb-0 lg:mx-3">
                            Cart
                        </NavLink>
                    </nav>
                </div>

                {/* Right Section (Search, Profile, Cart) */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border px-2 py-1 rounded-l text-sm"
                        />
                        <button type="submit" className="bg-black text-white px-3 py-1 rounded-r text-sm">
                            Go
                        </button>
                    </form>

                    {/* Profile Icon */}
                    <a href="#" className="hover:scale-110 transition duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M16 5.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm1 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Zm-12.5 14c0-2.143.486-3.732 1.596-4.796C7.212 13.634 9.058 13 12 13c2.942 0 4.788.635 5.904 1.704 1.11 1.064 1.596 2.652 1.596 4.796a.5.5 0 0 0 1 0c0-2.275-.514-4.186-1.904-5.518C17.212 12.656 15.058 12 12 12c-3.058 0-5.212.656-6.596 1.982C4.014 15.314 3.5 17.225 3.5 19.5a.5.5 0 0 0 1 0Z"
                            ></path>
                        </svg>
                    </a>

                    {/* Cart Icon */}
                    <a href="/cart" className="relative hover:scale-110 transition duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <circle cx="16.75" cy="19.949" r=".75"></circle>
                            <circle cx="9.75" cy="19.949" r=".75"></circle>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18 18.2a.5.5 0 0 0 0-1h-7.99a2.5 2.5 0 0 1-2.46-2.06l-.123-.688h9.16a2.5 2.5 0 0 0 2.355-1.66l1.55-4.34a1.5 1.5 0 0 0-1.413-2.004H5.997l-.065-.364A3.5 3.5 0 0 0 2.488 3.2h-.99a.5.5 0 1 0 0 1h.99a2.5 2.5 0 0 1 2.46 2.06l1.617 9.057a3.5 3.5 0 0 0 3.446 2.884H18ZM6.176 7.45l12.903-.001a.5.5 0 0 1 .47.668l-1.548 4.34a1.5 1.5 0 0 1-1.413.996h-9.34L6.176 7.45Z"
                            ></path>
                        </svg>
                        {cartCounter > 0 && (
                            <span className="bg-white text-black border text-xs absolute -top-2 -right-2 py-0.5 px-1.5 rounded-full">
                                {cartCounter}
                            </span>
                        )}
                    </a>
                </div>
            </div>
        </header>
    );
}

export default Header;
