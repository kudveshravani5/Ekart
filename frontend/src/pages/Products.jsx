import Filtersidebar from "@/components/ui/Filtersidebar";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ui/ProductCard";
import { toast } from "sonner";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { setProducts, setFilteredProducts } from "../redux/productSlice";

const Products = () => {
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [brand, setBrand] = useState("ALL");
  const [priceRange, setPriceRange] = useState([0, 99999]);

  const { products = [], filteredProducts = [] } = useSelector(
    (store) => store.product || {},
  );

  const dispatch = useDispatch();

  // Helper function to get price - handles both field names
  const getPrice = (product) => {
    // Try productPrice first (new), then Productprice (old)
    return Number(product.productPrice ?? product.Productprice ?? 0);
  };

  // 1. Fetch products
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/v1/product/getallproducts",
        );
        if (res.data.success) {
          dispatch(setProducts(res.data.products));
          // Initially set filtered products to all products
          dispatch(setFilteredProducts(res.data.products));
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, [dispatch]);
  
  // 2. Apply filters whenever any filter changes
  useEffect(() => {
    let filtered = [...products];

    // 🔍 Search - only filter if search has value
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📂 Category - only filter if not "ALL"
    if (category !== "ALL") {
      filtered = filtered.filter((p) => {
        if (!p.category) return false;
        const match = p.category.toLowerCase().trim() === category.toLowerCase().trim();
        return match;
      });
      console.log('After category filter:', filtered.length);
    }

    // 🏷️ Brand - only filter if not "ALL"
    if (brand !== "ALL") {
      filtered = filtered.filter((p) => {
        if (!p.brand) return false;
        const match = p.brand.toLowerCase().trim() === brand.toLowerCase().trim();
        return match;
      });
      
    }

    // 💰 Price - FIXED: handles both productPrice and Productprice
    filtered = filtered.filter((p) => {
      const price = getPrice(p);
      const inRange = price >= priceRange[0] && price <= priceRange[1];
      if (!inRange) {
        console.log(`Filtered out ${p.productName}: price ${price} not in range [${priceRange[0]}, ${priceRange[1]}]`);
      }
      return inRange;
    });
   

    // 🔃 Sorting - FIXED: uses helper function
    if (sortOrder === "lowtohigh") {
      filtered.sort((a, b) => getPrice(a) - getPrice(b));
    }

    if (sortOrder === "hightolow") {
      filtered.sort((a, b) => getPrice(b) - getPrice(a));
    }

    console.log('Final filtered products:', filtered.length);
    console.log('Products:', filtered.map(p => ({
      name: p.productName, 
      price: getPrice(p),
      category: p.category,
      brand: p.brand
    })));
    
    dispatch(setFilteredProducts(filtered));
  }, [search, category, brand, priceRange, sortOrder, products, dispatch]);

  return (
    <div className="pt-24 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">
        {/* Sidebar */}
        <Filtersidebar
          allProducts={products}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          search={search}
          setSearch={setSearch}
          brand={brand}
          setBrand={setBrand}
          category={category}
          setCategory={setCategory}
        />

        {/* Main */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-8 relative z-50">
            <Select onValueChange={setSortOrder}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                sideOffset={12}
                align="end"
                className="z-[9999]"
              >
                <SelectGroup>
                  <SelectItem value="lowtohigh">Price: Low to High</SelectItem>
                  <SelectItem value="hightolow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {loading ? (
              // Show loading skeletons
              Array(5).fill(0).map((_, idx) => (
                <ProductCard key={idx} loading={true} />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  loading={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;