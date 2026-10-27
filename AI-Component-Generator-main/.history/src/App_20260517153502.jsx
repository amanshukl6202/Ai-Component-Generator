import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App