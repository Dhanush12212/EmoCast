import React from 'react'
import {filters} from '../constants'

function FilterBar() {
  return (
    <div className='w-full h-20 ml-40 items-center gap-4 flex text-xl font-semibold text-[#BABABA]'>
      {filters.map((name, idx) => {
        return (
          <button key={idx} className='border-0 flex items-center p-3  rounded-lg hover:bg-[#3C3C3C] bg-[#222222] '>{name}</button>
        );
        })}
         
    </div>
  )
}

export default FilterBar;