import React from 'react'

export default function () {
  return (
    <>
    <div className="background-Image">
      <div class="about_content">
        <div>
          <h2 className='about-headings'>About Graphical User Interfance</h2>
          <p className='about-paragraph'>In this GUI, functionality is provided to upload a CSV file, tune hyperparameters of the model, train and test the model and finally predict output values for the given inputs. Generalized Additive Model (GAM) is used as a machine learning model.</p>
        </div>

        <div>
          <h2 className='about-headings'>GAM Introduction</h2>
          <p className='about-paragraph'>In statistics, a generalized additive model (GAM) is a generalized linear model in which the linear response variable depends linearly on unknown smooth functions of some predictor variables, and interest focuses on inference about these smooth functions.</p>
        </div>

        <div>
          <h2 className='about-headings'>Why using GAM?</h2>
          <p className='about-paragraph'>Interpretability, flexibility/automation, and regularization are the reasons for using GAM. When a model contains nonlinear effects, GAM provides a regularized and interpretable solution while other methods generally lack at least one of these three features. In other words, GAMs strike a nice balance between the interpretable, yet biased, linear model, and the extremely flexible, “black box” learning algorithms.</p>
        </div>

        <div >
          <h2 className='about-headings'>Directions for Uploading a File.</h2>
          <p className='about-paragraph'>1. Upload a 'CSV' fromat file.</p>
          <p className='about-paragraph'>2. There can be any number of input columns but should have only 'one' output column.</p>
          <p className='about-paragraph'>3. Make sure the output column is the right-most (last) column of the CSV file.</p>
          <p className='about-paragraph'>4. File should have only 'one' header row.</p>
          <p className='about-paragraph'>5. There should be 'no' serial number column in the file.</p>
        </div>

        <div >
          <h2 className='about-headings'>Instructions to Predict Values.</h2>
          <p className='about-paragraph'>1. Remember to enter the "exact" number of input values where were present in the CSV file during the training.</p>
          <p className='about-paragraph'>2. After entering, submit the values and check the predicted value.</p>
          <p className='about-paragraph'>3. Trained model can be downloaded by clicking the "Download Trained Model" button.</p>
        </div>

      </div>
      </div>
        </>
  )
}
