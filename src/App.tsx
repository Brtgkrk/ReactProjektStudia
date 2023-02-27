import React, { useState } from "react";
import { Routes, Route } from "react-router-dom"
import Login from "./components/LoginPage";
import PostPage from "./components/PostPage";
import HomePage from "./components/HomePage";
import PhotosPage from "./components/PhotosPage";
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

        {loggedInUser ? (
          <Route path="/posty" element={ <PostPage loggedInUser={loggedInUser} /> } />
        ) : (
          <Route path="/posty" element={ <Login setLoggedInUser={setLoggedInUser} /> } />
        )}

        {loggedInUser ? (
          <Route path="/album/:albumId" element={ <PhotosPage loggedInUser={loggedInUser} /> } />
        ) : (
          <Route path="/" element={ <Login setLoggedInUser={setLoggedInUser} /> } />
        )}

      </Routes>
    </div>
  );
}

export default App;
