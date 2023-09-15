'use client'
import React, { useState } from "react";
import { useSelector } from "react-redux"
import { productState } from "@/app/Redux/features/actions/productsSlice"
import { useAddProductMutation } from "@/app/Redux/features/services/productsService";
import { SearchBar } from "@/app/components/SearchBar";
import FilterDropdown from "@/app/components/FilterDropDown";

export default function Products() {
    const baba: productState[] = useSelector((state: any) => state.products);
    const [addProduct, { isLoading: isAddProductLoading }] = useAddProductMutation()
    const [data, setData] = useState({
        title: '',
        description: '',
        specs: '',
        price: 0,
        category: '',
        images: [],
    });
    const options = ['Option 1', 'Option 2', 'Option 3'];
    console.log(baba)
    return (
        <div>
            <div className='p-8 text-[32px] text-center font-semibold'>
                Products
            </div>
            <div className='grid grid-cols-3 gap-4 pt-[20px]'>
                <div className='col-span-2 w-full'>
                    <SearchBar
                        onSearch={() => { }}
                    />
                </div>
                <div>
                    <FilterDropdown
                        options={options}
                        onSelect={() => { }}
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-[20px]'>
                <div className="h-300px bg-white shadow-xl rounded-xl flex items-center justify-center">
                    <svg
                        className="w-12 h-12 text-gray-500 cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}