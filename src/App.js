import logo from './logo.svg';
import './App.css';
import Header from './components/header'
import Home from './components/Home'
import About from './components/about'
import Test from './components/train_ml'
import Post_training from './components/post_training'
import Prediction from './components/prediction'
import {Route, Routes} from "react-router-dom"
import React from "react";



function App() {
  
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/AMT/home' element={<Home/>} />
      <Route path='/AMT/train_model' element={<Test/>} />
      <Route path='/AMT/extrema' element={<Post_training/>} />
      <Route path='/AMT/prediction' element={<Prediction/>} />
      <Route path='/AMT/about' element={<About/>} />
      
    </Routes>
    
    </>
    
  );
}

export default App;
