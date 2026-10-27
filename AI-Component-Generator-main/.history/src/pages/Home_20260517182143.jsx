import React from 'react'
import Navbar from '../components/Navbar';


const Home = () => {
    return(
  <>
    <Navbar/>
    
    <div className="flex items-center px-[100px] justify-between gap-[30px]">
        <div className="left w-[50%] h-[80vh] bg-[#141319] mt-5 p-[20px]"></div>
        <h3 className='text-[25px] font-semibold sp-text'>AI Component Generator</h3>
        <p className='text-[gray] mt-2 text-[16px]'>Describe your component and let AI will code for you.</p>
        <div className="right w-[50%] h-[80vh] bg-[#141319] mt-5"></div>
        
    </div>
  </>
)
}
   

export default Home