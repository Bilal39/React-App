import logo from './logo.svg';
import './App.css';
import Header from './components/header'
import Home from './components/Home'
import About from './components/about'
import Test from './components/train_ml'
import Post_training from './components/post_training'
import Prediction from './components/prediction'
import {Route, Routes} from "react-router-dom"
import React, { useState, useEffect } from "react";



function App() {
  
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/train_model' element={<Test/>} />
      <Route path='/post_training' element={<Post_training/>} />
      <Route path='/prediction' element={<Prediction/>} />
      <Route path='/about' element={<About/>} />
      
    </Routes>
    
    </>
    
  );
}

export default App;
