import React from 'react'
import qeeriLogo from '../assests/images/qeeri-logo.png'
import qnrfLogo from '../assests/images/qnrf-logo.png'
import qeeri2Logo from '../assests/images/qeeri_logo.png'
import { Link } from 'react-router-dom'
import { CDBFooter, CDBBox, CDBFooterLink, CDBBtn, CDBIcon, CDBContainer } from 'cdbreact';

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
      <CDBFooter className="shadow">
        <CDBBox
          display="flex"
          justifyContent="between"
          alignItems="center"
          className="mx-auto py-4 flex-wrap"
          style={{ width: '80%' }}
        >
          <CDBBox display="flex" alignItems="center">
            <a href="/" className="d-flex align-items-center p-0 text-dark">
              <img
                alt="logo"
                src={qeeri2Logo}
                width="150px"
              />
            </a>
          </CDBBox>
          <CDBBox>
            <small className="ml-2">&copy; Copyright ©2022 All rights reserved to Hamad Bin Khalifa University.</small>
          </CDBBox>
          <CDBBox display="flex">
            <CDBBtn flat color="grey" className="p-2">
              <CDBFooterLink href="https://www.facebook.com/Qatar-Environment-Energy-Research-Institute-QEERI-811838925494210/community/">
                <CDBIcon fab icon="facebook-f" />
              </CDBFooterLink>
            </CDBBtn>

            <CDBBtn flat color="grey" className="mx-3 p-2">
              <CDBFooterLink href="https://twitter.com/qeeri_qa">
                <CDBIcon fab icon="twitter" />
              </CDBFooterLink>
            </CDBBtn>
          </CDBBox>
        </CDBBox>
      </CDBFooter>

    </>
  )
}
