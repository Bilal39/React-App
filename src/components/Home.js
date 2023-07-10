import React from 'react'

export default function Home() {
  return (
    <>
      <body>
        <div>
        </div>
        <video loop muted autoPlay className='welcome_video'>
          <source
            src={require("../assests/Digital_Data.mp4")}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div class="content">
          <h1>Welcome to Automated Model Training (AMT)</h1>
          <p>Goto 'Train Model' and upload a file to train a model</p>
        </div>
      </body>
    </>
  )
}
