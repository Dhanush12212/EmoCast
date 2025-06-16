import React from 'react'  
import { assets } from '../../assets/assets';
import {sidebarItems, Channels} from '../../constants';
import {Link} from 'react-router-dom'
 
function SideFullBar() {
  return ( 
    <div className='bg-[#121212] w-80 px-6 py-3 h-full'> 

        {sidebarItems.map((item, idx) => { 
            if(item.divider) return  <div key={idx} className='border-[2px] border-[#222222]'></div>;
            
            return (
              <Link to={item.path} key={idx} className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl cursor-pointer'>
                <item.icon className='w-8 h-8' />
                <span className='text-xl font-medium'>{item.label}</span>
              </Link>
            );
        })}

        {/* SubScriptions */}
        <div> 
            <h1 className='text-2xl font-medium mt-5 mx-2'>Subscriptions</h1> 
            {Channels.map((name, idx) => {
                return ( 
                    <div key={idx} className='flex items-center gap-5 hover:bg-[#3D3D3D] p-3 rounded-xl' >
                    <img
                        src={assets.Subscription}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover cursor-pointer"
                        />
                    <span className='text-lg font-medium'>{name}</span>
                    </div> 
                );
            })}

        </div>
    </div>
  )
}

export default SideFullBar