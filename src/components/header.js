import React from 'react'
import qeeriLogo from '../assests/images/qeeri-logo.png'
import amtLogo from '../assests/images/amt-logo.png'
import { Link } from 'react-router-dom'


export default function header({ modelTrained }) {
  return (
    <>
      <header>
        <img src={amtLogo} className='amtlogo' alt="amt_logo" />
        <img src={qeeriLogo} className='qeerilogo' alt="qeeri_logo" />

      </header>

      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/AMT/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/AMT/train_model">Train Model</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/AMT/extrema">Extrema</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/AMT/prediction">Prediction</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/AMT/about">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>


    </>
  )
}
