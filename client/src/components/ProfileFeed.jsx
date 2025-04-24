import React from 'react'
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FaGoogle } from "react-icons/fa"; 
import { assets } from '../assets/assets';
import SampleVideo from './SampleVideo';

function ProfileFeed() {
 
  return (
    <div className='px-2 flex flex-col gap-10'>
        <div className='h-full px-10 w-full flex gap-6 '> 
        <div className="flex justify-center items-center">
            <img src={assets.Subscription} alt="Subscription Icon" className="h-40 w-40 p-1 bg-white rounded-full" />
        </div>

            <div className='flex flex-col gap-3 justify-center'>
                <h1 className='text-4xl font-bold'>Dhanush Moagaveer</h1>
                <div className='flex text-lg font-medium gap-5'>
                    <h1>@dhanushmogaveer5316</h1>
                    <p>view channel</p>
                </div>
                <div className='flex gap-6'>
                    <button className='bg-[#272727] hover:bg-[#3F3F3F] px-3 py-2 rounded-2xl flex gap-2 items-center'>
                        <MdOutlineSwitchAccount className='h-5 w-5'/>
                        <label htmlFor="">Switch Acount</label>
                    </button>
                    <button className='bg-[#272727] hover:bg-[#3F3F3F] px-3 py-2 rounded-2xl flex gap-2 items-center'>
                        <FaGoogle className='h-5 w-5'/>
                        <label htmlFor="">Google account</label>
                    </button> 
                </div>
            </div> 
        </div>

        {/* History */}
        <div>
            <h1 className='text-2xl font-bold px-10'>History</h1> 
            <SampleVideo/>
        </div>

        {/* PlayList */}
        <div>
            <h1 className='text-2xl font-bold px-10'>PlayList</h1> 
            <SampleVideo/>
        </div>

        {/* Watch Later */}
        <div>
            <h1 className='text-2xl font-bold px-10'>Watch Later</h1> 
            <SampleVideo/>
        </div>

        {/* Liked Videos */}
        <div>
            <h1 className='text-2xl font-bold px-10'>Liked Videos</h1> 
            <SampleVideo/>
        </div>
         
    </div>
  )
}

export default ProfileFeed