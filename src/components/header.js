import React from 'react'
import qeeriLogo from '../assests/images/qeeri-logo.png'
import qnrfLogo from '../assests/images/qnrf-logo.png'
import { Link } from 'react-router-dom'

export default function header(props) {
  return (
    <>    
    <header>
    <img src={qeeriLogo} className='qeerilogo' alt="qeeri_logo" />
    <img src={qnrfLogo} className='qnrflogo' alt="qnrfLogo" />
    <h2>{props.header}</h2>
    </header>

<nav className="navbar navbar-expand-lg bg-light">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" to="/train_model">Train Model</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" to="/post_training">Result</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" to="/prediction">Prediction</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" to="/about">About</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}
