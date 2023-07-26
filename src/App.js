import logo from './logo.svg';
import './App.css';
import Header from './components/header'
import Home from './components/Home'
import About from './components/about'
import Test from './components/train_ml'
import Post_training from './components/post_training'
import Prediction from './components/prediction'
import { Route, Routes } from "react-router-dom"
import React, { useState } from "react";



function App() {
  const [modelTrained, setModelTrained] = useState(false); // State variable to track model training status

  return (
    <>
      <Header modelTrained={modelTrained} />
      <Routes>
        <Route path='/AMT/home' element={<Home />} />
        <Route path='/AMT/train_model' element={<Test setModelTrained={setModelTrained} />} />
        <Route path='/AMT/extrema' element={modelTrained ? <Post_training /> :
          <p className="about-headings-train" style={{
            color: '#ff0000', marginLeft: '4%',
            marginTop: '1%', fontStyle: 'italic'
          }} >Please train the model first.</p>} />
        <Route
          path='/AMT/prediction'
          element={modelTrained ? <Prediction /> : <p className="about-headings-train"
            style={{ color: '#ff0000', marginLeft: '4%', marginTop: '1%', fontStyle: 'italic' }}
          >Please train the model first.</p>}
        />
        <Route path='/AMT/about' element={<About />} />
      </Routes>

    </>

  );
}

export default App;
