import logo from './logo.svg';
import './App.css';
import Header from './components/header'
import Home from './components/Home'
import About from './components/about'
import Train_ml from './components/train_ml'
import Post_training from './components/post_training'
import {Route, Routes} from "react-router-dom"
import React, { useState, useEffect } from "react";


function App() {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/train_model' element={<Train_ml/>} />
      <Route path='/post_training' element={<Post_training/>} />
      <Route path='/about' element={<About/>} />
      
    </Routes>
    
    </>
    
  );
}

export default App;
