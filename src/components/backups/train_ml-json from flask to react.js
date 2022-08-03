import React, { useState, useEffect } from "react";

export default function () {
  // usestate for setting a javascript
    // object for storing and using data
    const [data, setdata] = useState({
  });

  // Using useEffect for single rendering
  useEffect(() => {
      // Using fetch to fetch the api from 
      // flask server it will be redirected to proxy
      fetch("/data").then((res) =>
          res.json().then((data) => {
              // Setting a data from api
              setdata({
                  name: data.Name,
                  age: data.Age,
                  date: data.Date,
                  programming: data.programming,
              });
          })
      );
  }, []);

  return (
    <>
        <form>
          <h2>React File Upload</h2>
          <input type="file" enctype = "multipart/form-data"></input>/>
          <button type="submit">Upload</button>
        </form>
        <div className="App">
                <h1>Data From Flask</h1>
                {/* Calling a data from setdata for showing */}
                <p>{data.name}</p>
                <p>{data.age}</p>
                <p>{data.date}</p>
                <p>{data.programming}</p>

        </div>
    </>
  )
}
