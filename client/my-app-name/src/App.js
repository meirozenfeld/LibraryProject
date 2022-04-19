// import React from 'react';
import React, { useEffect, useState } from 'react'

//TRY1
// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { apiResponse: "" };
//   }
//   callApi() {
//     fetch("http://localhost:3000/users").then(res => res.text()).then(res => this.setState({ apiResponse: res }));
//   }
//   componentWill() {
//     this.callApi();
//   }
//   render() {
//     return (
//       <div>
//         <p>{this.state.apiResponse}</p>
//       </div>
//     );
//   }
// }

//TRY2
// function App() {

//   const [backendData, setBackendData] = useState([]);

//   useEffect(() => {
//     fetch("/users").then(
//       response => response.json()
//     ).then(
//       data => {
//         setBackendData(data)
//       }
//     )
//   }, [])

//   return (
//     <div>
//       {(typeof backendData.users === 'undefined') ? (
//         <p>Loading...</p>
//       ) : (
//         backendData.users.map((user, i) => (
//           <p key={i}>{user}</p>
//         ))
//       )}
//     </div>)
// }


//TRY3

function App() {
  const [initialState, setInitialState] = useState([]);
  useEffect(() => {
    fetch("/users").then(
      res => {
        if (res.ok) {
          return res.json()
        }
      }
    ).then(
      jsonResponse => {
        setInitialState(jsonResponse.data.users)
        // console.log(jsonResponse.data.users)
      }
    )
  }, [])
  return (
    <div>
      <>{initialState.length > 0 && initialState.map((e, i) => <li key={i}>{e.name}</li>)}</>
    </div>
  );
}
export default App