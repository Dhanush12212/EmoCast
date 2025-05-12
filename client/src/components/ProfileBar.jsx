import React, {useState} from 'react'
import {assets} from '../assets/assets';
import { profileItem } from '../constants';
import { Link } from 'react-router-dom';

function Profile() { 
  return (
    <div className='h-screen bg-[#222222] lg:w-[300px] flex flex-col right-0 z-10 rounded-3xl left-0 '>
        <div className='flex gap-7 p-4'>
            <img
                src={assets.Profile}
                alt="Profile"
                className="h-14 w-14 rounded-full object-cover cursor-pointer mt-2"
            />
            <div className='text-xl font-semibold'>
                <h1>Dhanush</h1>
                <p>@dhanushmogaveer1221</p>
                <p className='text-blue-500 mt-3 cursor-pointer'>View your channel</p>
            </div>
        </div>

        <div className='p-3 text-xl flex flex-col '>

          {profileItem.map((item, idx) => {
            if(item.divider) return <div key={idx} className='border-1 border-[#3c3c3c] w-full h-0 left-0'></div>

            return (
            <Link to={item.path}  key={idx} className='flex gap-5 hover:bg-[#3E3E3E] rounded-xl p-3 items-center cursor-pointer'>
              <item.icon className='w-8 h-8'/>
              <label htmlFor="" className='cursor-pointer'>{item.label}</label>
            </Link>
            ) 
          })} 
        </div> 

    </div>
  )
}

export default Profile