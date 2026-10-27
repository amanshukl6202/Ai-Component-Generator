import React from 'react'
import Navbar from '../components/Navbar';


const Home = () => {
    return(
  <>
    <Navbar/>
    
    <div className="flex items-center px-[100px] justify-between gap-[20px]">
        <div className="left w-[45%] h-[50vh] bg-[#141319] mt-5"></div>
        <div className="right"></div>
        
    </div>
  </>
)
}
   

export default Home