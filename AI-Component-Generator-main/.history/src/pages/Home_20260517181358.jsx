import React from 'react'
import Navbar from '../components/Navbar';


const Home = () => {
    return(
  <>
    <Navbar/>
    
    <div className="flex items-center px-[100px] justify-between gap-[30px]">
        <div className="left w-[50%] h-[80vh] bg-[#141319] mt-5"></div>
        <div className="right w-[50%] h-[80vh] bg-[#141319] mt-5"></div>
        
    </div>
  </>
)
}
   

export default Home