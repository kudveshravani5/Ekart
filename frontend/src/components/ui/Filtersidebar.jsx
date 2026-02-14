import React from 'react'
import { Input } from '@/components/ui/input';


const Filtersidebar = ({allProducts=[], priceRange=[0,99999], search, setSearch, brand, setBrand, category, setCategory ,setPriceRange}) => {
  // Extract unique categories - normalize to lowercase for comparison but keep original case for display
  const Categories = allProducts
    .map(p => p.category)
    .filter(c => c); // Remove null/undefined
  
  // Get unique categories (case-insensitive)
  const seenCategories = new Set();
  const UniqueCategories = ["ALL"];
  Categories.forEach(cat => {
    const normalized = cat.toLowerCase().trim();
    if (!seenCategories.has(normalized)) {
      seenCategories.add(normalized);
      UniqueCategories.push(cat); // Keep original case
    }
  });

  // Extract unique brands - normalize to lowercase for comparison but keep original case for display
  const Brands = allProducts
    .map(p => p.brand)
    .filter(b => b); // Remove null/undefined
  
  // Get unique brands (case-insensitive)
  const seenBrands = new Set();
  const UniqueBrands = ["ALL"];
  Brands.forEach(br => {
    const normalized = br.toLowerCase().trim();
    if (!seenBrands.has(normalized)) {
      seenBrands.add(normalized);
      UniqueBrands.push(br); // Keep original case
    }
  });

  const handleCategoryChange = (val) => {
    setCategory(val);
  }
  
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  }
  
  const handleMinChange =(e) => {
    const value = Number(e.target.value);
    if(value <= priceRange[1])
      setPriceRange([value, priceRange[1]]);
  }
  
  const handleMaxChange =(e) => {
    const value = Number(e.target.value);
    if(value >= priceRange[0])
      setPriceRange([priceRange[0], value]);
  }
  
  const resetFilters =()=>{
    setSearch("");
    setCategory("ALL");
    setBrand("ALL");
    setPriceRange([0,99999]);
  }


  return (
    <div className='bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64'>
      {/*Search*/}
      <Input type='text' 
      placeholder='Search...'
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className='bg-white p-2 rounded-md border-gray-400 border-2 w-full'/>
      
      {/*Categories*/}
      <h1 className='mt-5 font-semibold text-xl'>Category</h1>
      <div className='flex flex-col gap-2 mt-3'>
        {
          UniqueCategories.map((item, index) => {
            return (
              <div key={index} className='flex items-center gap-7'>
                <input 
                  type='radio' 
                  checked={category === item} 
                  onChange={()=>handleCategoryChange(item)}
                />
                <label htmlFor=''>{item}</label>
              </div>
            )
          })
        }
      </div>
      
      {/*Brands*/}
      <h1 className='mt-5 font-semibold text-xl'>Brand</h1>
      <select 
        className='bg-white w-full p-2 border-gray-200 border-2 rounded-md' 
        value={brand} 
        onChange={handleBrandChange}
      >
        {
          UniqueBrands.map((item, index)=>{
            return <option key={index} value={item}>{item.toUpperCase()}</option>
          })
        }
      </select>
      
      {/*Price Range*/}
      <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
      <div className='flex flex-col gap-2'>
        <label>
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <div className='flex gap-2 items-center'>
          <input 
            type='number' 
            min='0' 
            max='99999' 
            value={priceRange[0]}
            onChange={handleMinChange}  
            className='w-20 p-1 border border-gray-300 rounded-md' 
          />
          <span>-</span>
          <input 
            type='number' 
            min='0' 
            max='99999' 
            value={priceRange[1]} 
            onChange={handleMaxChange} 
            className='w-20 p-1 border border-gray-300 rounded-md' 
          />
        </div>
        <input 
          type='range' 
          min='0' 
          max='99999' 
          step='100' 
          className='w-full' 
          value={priceRange[0]} 
          onChange={handleMinChange}
        />
        <input 
          type='range' 
          min='0' 
          max='99999' 
          step='100' 
          className='w-full' 
          value={priceRange[1]} 
          onChange={handleMaxChange}
        />
      </div>
      
      {/*Reset Button*/}
      <button 
        className='mt-5 bg-pink-600 text-white p-2 rounded-md cursor-pointer hover:bg-pink-500 w-full' 
        onClick={resetFilters}
      >
        Reset Filters
      </button>
    </div>
  )
}

export default Filtersidebar;