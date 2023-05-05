import React from 'react'

export default function () {
  return (
    <>
      <body>
        <div className="background-Image">
          <div class="about_content">
            <div>
              <h2 className='about-headings'>About Graphical User Interfance</h2>
              <p className='about-paragraph'>This Graphical User Interface (GUI) offers a comprehensive suite of features to facilitate the seamless
                implementation and utilization of machine learning models.
                At the heart of the GUI lies the capability to upload a CSV file,
                which serves as the foundation for the training and testing of the Generalized Additive Model (GAM) algorithm.
                The GUI also provides a flexible platform for the tuning of hyperparameters, allowing for optimal performance of the model.
              </p>
              <p className='about-paragraph'>
                Upon completion of the training and testing phase, the GUI empowers the user to predict output values for given inputs with ease and accuracy.
                This integration of robust functionalities within a seamless and intuitive interface makes the GUI a valuable tool
                for both novice and experienced practitioners of machine learning.</p>
            </div>

            <div>
              <h2 className='about-headings'>GAM Introduction</h2>
              <p className='about-paragraph'>Within the realm of statistics, the Generalized Additive Model (GAM) stands as a pioneering methodology that embodies the principles of Generalized Linear Models (GLMs). The defining characteristic of a GAM is the utilization of non-linear and continuous functions to model the relationship between the linear response variable and the predictor variables. This departure from traditional linear models allows for a more nuanced and sophisticated representation of complex relationships between variables.
              </p>
              <p className='about-paragraph'>
                The emphasis of inference in GAMs is directed towards the estimation of these smooth functions and the extraction of meaningful insights from the data. By leveraging the flexibility of non-linear functions, GAMs provide a more comprehensive understanding of the underlying relationships and patterns in the data, thereby facilitating informed decision-making and predictive accuracy.
              </p>
              <p className='about-paragraph'>
                In conclusion, the Generalized Additive Model stands as a remarkable tool for statistical inference and analysis, offering a new perspective on the relationships between variables and enabling a deeper understanding of the underlying patterns in the data.</p>
            </div>

            <div>
              <h2 className='about-headings'>Why using GAM?</h2>
              <p className='about-paragraph'>The Generalized Additive Model (GAM) has garnered significant attention and usage due to its exceptional combination of interpretability, flexibility, and regularization. In the realm of statistical modeling, it is not uncommon to encounter models that possess nonlinear effects, which can lead to difficulties in interpretation and regularization.
              </p><p className='about-paragraph'>
                However, the GAM offers a unique solution that strikes a harmonious balance between the interpretability and bias of linear models and the extreme flexibility of "black box" learning algorithms. By leveraging the power of non-linear functions, GAMs provide a regularized and interpretable representation of the relationships between variables while still retaining the ability to capture complex nonlinear effects.
              </p> <p className='about-paragraph'>
                Additionally, the automation inherent in GAMs provides the added benefit of ease-of-use and reduces the need for manual intervention. This combination of interpretability, flexibility, and regularization make the Generalized Additive Model an invaluable tool for statistical analysis and prediction.</p>
            </div>


          </div>
        </div>
      </body>
    </>
  )
}
