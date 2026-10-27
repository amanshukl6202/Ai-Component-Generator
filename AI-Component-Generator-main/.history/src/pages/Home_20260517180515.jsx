import React from 'react'
import Navbar from '../components/Navbar';


const Home = () => {
    return(
  <>
    <Navbar/>
    
    <div className="flex items-center px-[100px] justify-between gap-[20ox]">
        <div className="left w-[45%] h-[50vh] bg-zinc-800 mt-10"></div>
        <div className="right w-[45%] h-[50vh] bg-zinc-800 mt-10"></div>
    </div>
  </>
)
}
   

export default Home