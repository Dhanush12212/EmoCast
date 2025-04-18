import React from 'react'  
import { assets } from '../assets/assets';
import {sidebarItems, Channels} from '../SideBarItem';
 
function SideFullBar() {
  return ( 
    <div className='bg-[#171717] w-80 px-6 py-3 h-full'> 

        {sidebarItems.map((item, idx) => { 
            if(item.divider) return  <div key={idx} className='border-[2px] border-[#222222]'></div>;
            
            return (
              <div key={idx} className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
                <item.icon className='w-8 h-8' />
                <label htmlFor="Home" className='text-xl font-medium'>{item.label}</label>
              </div>
            );
        })}

        {/* SubScriptions */}
        <div> 
            <h1 className='text-2xl font-medium mt-5 mx-2'>Subscription</h1> 
            {Channels.map((name, idx) => {
                return ( 
                    <div key={idx} className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl'>
                    <img
                        src={assets.Subscription}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover cursor-pointer"
                        />
                    <label htmlFor="Home" className='text-lg font-medium'>{name}</label>
                    </div> 
                );
            })}

        </div>
    </div>
  )
}

export default SideFullBar