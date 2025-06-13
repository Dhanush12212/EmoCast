import React, { useRef, useState, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'; 
import axios from 'axios';
import { API_URL } from '../../../config'; 

function FilterBar({selectedCategory, onSelect}) {
  const [tags, setTags] = useState([]);
  const scrollRef = useRef(null); 

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const width = 200;  //200px
    scrollRef.current.scrollBy({ left: direction === 'left' ? -width : width, behavior: 'smooth' });
  }; 

  useEffect(() => {
    const fetchCategories = async() => { 
      try { 
        let response = await axios.get(`${API_URL}/playlist/categories`); 
        setTags(response.data.categories || [] ); 
      } catch(error) {
        console.log(error.response?.data?.message || 'Failed to fetch Categories!!');
      }
    }

    fetchCategories();
  }, []);
 
     
  return (
    <div className="relative w-[96%] px-8 py-3 h-20 left-10 mt-20">
      
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-2/5 -translate-y-1/2 z-10 bg-black/90 hover:bg-black rounded-full p-1 h-12"
      >
        <AiOutlineLeft className="text-white w-5 h-6 " />
      </button>
    
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        <div className="inline-flex gap-3 items-center ">
          {tags.map(({id, title}) => (
            <button
              key={id}
              onClick={() => {
                onSelect({id, title}); 
              }}
              className={`snap-start whitespace-nowrap px-4 py-2 rounded-lg text-lg font-medium ${
              selectedCategory === id ? 'bg-white text-black' : 'bg-[#272727] text-[#FEFEFE]'
              } hover:bg-[#3d3d3d]`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* Right Scroll Icon */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-2/5 -translate-y-1/2 z-10 bg-black/70 hover:bg-black rounded-full p-1 h-12"
      >
        <AiOutlineRight className="text-white w-5 h-5" />
      </button>
    </div>
  );
}

export default FilterBar;
