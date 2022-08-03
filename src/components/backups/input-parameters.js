import React, { Component } from 'react'

class Form extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       splines:'',
       lambdaval:''
    }
  }
  handleSplineChange = (event) => {
    this.setState({
      splines:event.target.value
    })

  }
  handleLamdaChange = (event) => {
    this.setState({
      lambdaval:event.target.value
    })
  }

  handleSubmitChange = event => {
    alert(`${this.state.splines} ${this.state.lambdaval}`)
  }


  render() {
    return (
      <form className='parametersform' onSubmit = {this.handleSubmitChange}>
        <div>
          <label>Number of Splines</label>
          <input type='text' value={this.state.splines} onChange = {this.handleSplineChange}/>
        </div>
        <div>
          <lable>Lambda Value</lable>
          <input type='text' value = {this.state.lambdaval} onChange = {this.handleLamdaChange}/>
        </div>
        <button type='submit'>Submit</button>
      </form>
    )
  }
}

export default Form