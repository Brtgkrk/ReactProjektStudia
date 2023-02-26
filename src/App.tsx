import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"
import Login from "./components/LoginPage";
import HomePage from "./components/PostPage";
//import UserList from "./components/UserList";

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  
  return (
    <div className="App">
      <Routes>
        {loggedInUser ? (
          <Route path="/" element={ <HomePage loggedInUser={loggedInUser} /> } />
        ) : (
          <Route path="/" element={ <Login setLoggedInUser={setLoggedInUser} /> } />
        )}
      </Routes>
    </div>
  );
}

export default App;
