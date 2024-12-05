import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login';
import Register from './Register';
import Home from './Home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />    
      <Route path="/signin" element={<Register/>} />  
      <Route path="/home"element={<Home/>}/>
      </Routes>
      </BrowserRouter>
  )
}

export default App