import logo from './logo.svg';
import './App.css';
import Header from './components/header'
import Home from './components/Home'
import About from './components/about'
import Train_ml from './components/train_ml'
import Post_training from './components/post_training'
import Prediction from './components/prediction'
import {Route, Routes} from "react-router-dom"
import React, { useState, useEffect } from "react";


function App() {
  console.log("app.js")
  const [data, setData] = useState({trained_r: '', tested_r: '', mstatus: 'in progress..', flag: false
  });

  
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/train_model' element={<Train_ml value={{data,setData}}/>} />
      <Route path='/post_training' element={<Post_training value={{data,setData}}/>} />
      <Route path='/prediction' element={<Prediction/>} />
      <Route path='/about' element={<About/>} />
      
    </Routes>
    
    </>
    
  );
}

export default App;
