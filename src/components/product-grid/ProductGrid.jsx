import React, { useState, useEffect } from "react";

import ProductSorting from "./ProductSorting";
import ProductFiltering from "./ProductFiltering";
import AddToCartButton from "./addToCartButton";
import ProductCounter from "./ProductCounter";
import StarRatings from "./StarRatings";

import { ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ITEMS_PER_PAGE = 12;
const INITIAL_PAGE_COUNT = 1;

function ProductGrid({ category }) {
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState({});
    const [filteredProducts, setFilteredProducts] = useState({});
    const [pageCount, setPageCount] = useState(INITIAL_PAGE_COUNT);

    const [productData, setProductData] = useState({
        products: [],
        isDataLoaded: false,
    });

    // ✅ Fetch Products by Category
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const endpoint = category
                    ? `/api/products?category=${category}`
                    : `/api/products`;

                const response = await fetch(endpoint);
                const data = await response.json();

                setProductData({
                    products: data,
                    isDataLoaded: true,
                });

                console.log("✅ Products fetched:", data.length);
            } catch (error) {
                console.error("❌ Error fetching products", error);
            }
        };

        fetchProductData();
    }, [category]);

    // ✅ Apply Sorting + Filtering
    useEffect(() => {
        validate();
    }, [sortedProducts, filteredProducts, productData]);

    const getCategoryProducts = () => {
        return productData.products;
    };

    const validate = () => {
        if (sortedProducts.isSorted && !filteredProducts.isFiltered) {
            return setProducts(sortedProducts.products);
        }

        if (filteredProducts.isFiltered && !sortedProducts.isSorted) {
            return setProducts(filteredProducts.products);
        }

        if (sortedProducts.isSorted && filteredProducts.isFiltered) {
            return setProducts(
                sortedProducts.products.filter((product) =>
                    filteredProducts.products.some(
                        (fp) => fp.id === product.id
                    )
                )
            );
        }

        return setProducts(getCategoryProducts());
    };

    const handleLoadMore = () => {
        setPageCount((prev) => prev + 1);
    };

    const getPaginatedData = () => {
        const start = (pageCount - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return products.slice(0, end);
    };

    return (
        <>
            <div className="max-w-screen-2xl mx-auto p-9 flex flex-col md:flex-col lg:flex-row">
                <div className="flex flex-col relative lg:mr-8 mb-5 lg:mb-0">
                    <ProductFiltering
                        products={getCategoryProducts()}
                        setFilteredProducts={setFilteredProducts}
                    />
                </div>

                <div className="flex flex-col w-full">
                    <div className="flex justify-end sm:justify-between items-center text-sm mb-2">
                        <div className="hidden sm:block">
                            <ProductCounter
                                total={getCategoryProducts().length}
                            />
                        </div>

                        <ProductSorting
                            products={getCategoryProducts()}
                            setSortedProducts={setSortedProducts}
                        />
                    </div>

                    <div className="min-h-[80%]">
                        <ul className="mt-2 mb-12 product-list overflow-hidden grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {getPaginatedData().length > 0 ? (
                                getPaginatedData().map((product) => (
                                    <li
                                        key={product.id}
                                        className="flex flex-col product-item justify-between border p-3 rounded-lg shadow"
                                    >
                                        <a
                                            href={`/products/${product.uri}`}
                                            className="hover:underline flex flex-col items-center"
                                        >
                                            <LazyLoadImage
                                                effect="blur"
                                                src={product.image}
                                                alt={product.description}
                                                width={250}
                                                height={250}
                                                className="object-contain"
                                            />
                                            <span className="text-base mt-2">
                                                {product.title}
                                            </span>
                                        </a>

                                        <StarRatings rating={product.rating} />

                                        <p className="text-sm my-1 h-12 overflow-hidden text-ellipsis">
                                            {product.description}
                                        </p>

                                        {product.discounted_price ? (
                                            <div className="flex items-center space-x-2">
                                                <span className="line-through text-gray-500">
                                                    ${product.price}
                                                </span>
                                                <span className="text-emerald-600 font-semibold">
                                                    ${product.discounted_price}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-lg font-semibold">
                                                ${product.price}
                                            </span>
                                        )}

                                        <AddToCartButton product={product} />
                                    </li>
                                ))
                            ) : (
                                <span className="text-center w-full block mt-5">
                                    No products found.
                                </span>
                            )}
                        </ul>
                    </div>

                    <div className="flex justify-center mx-auto">
                        <div className="text-center">
                            <ProductCounter
                                count={getPaginatedData().length}
                                total={getCategoryProducts().length}
                            />

                            {products.length > pageCount * ITEMS_PER_PAGE && (
                                <button
                                    onClick={handleLoadMore}
                                    className="mt-3 text-black border border-gray-300 bg-white font-medium py-2 px-6 rounded hover:bg-gray-100"
                                >
                                    Load More
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </>
    );
}

export default ProductGrid;
