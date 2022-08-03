import axios, {post} from 'axios';
import React, { Component } from 'react'

class SubmitComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: ''
    }
  }
  onChange(e)
  {
    let files=e.target.files;
    let reader  = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = (e) => {
      const url = "./";
      const formData = {file: e.target.result}
      return post(url,formData).then(response => console.warn("result",response))
    }
  }

  render() {
    return(
      <div onSubmit={this.onFormSubmit}>
        <h1> Reage file upload</h1>
        <input type ="file" name='file' onChange={(e)=>this.onChange(e)} />
      </div>
    )
  }
}
export default SubmitComponent