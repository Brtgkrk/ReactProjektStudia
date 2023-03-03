import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"
import Login from "./components/LoginPage";
import PostPage from "./components/PostPage";
import HomePage from "./components/HomePage";
import PhotosPage from "./components/PhotosPage";
import UserPage from "./components/UserPage";
import UserList from "./components/UserList";
import PhotosSearchPage from "./components/PhotosSearchPage";
import CommentsPage from "./components/CommentsPage";

const App: React.FC = () => {
  const [loggedInUserDeprecated, setLoggedInUser] = useState<string | null>(null); //deprecated
  let loggedInUser: string;
  try {
    loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '');
  }
  catch (error) {
    loggedInUser = "";
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/');
    }
  }, [loggedInUser, navigate]);

  return (
    <div className="App">
      <Routes>
        {loggedInUser ? (
          <>
          <Route path="/" element={<HomePage loggedInUser={loggedInUser} />} />
          <Route path="/album/:albumId" element={<PhotosPage loggedInUser={loggedInUser} />} />
          <Route path="/posty" element={<PostPage loggedInUser={loggedInUser} />} />
          <Route path="/posty/:postId" element={<CommentsPage loggedInUser={loggedInUser} />} />
          <Route path="/uzytkownicy" element={<UserList loggedInUser={loggedInUser} />} />
          <Route path="/uzytkownicy/:username" element={<UserPage loggedInUser={loggedInUser} />} />
          <Route path="/zdjecia" element={<PhotosSearchPage loggedInUser={loggedInUser} />} />
          <Route path="*" element={<HomePage loggedInUser={loggedInUser} />} />
          </>
        ) : (
          <>
          <Route path="/" element={<Login setLoggedInUser={setLoggedInUser} />} />
          <Route path="*" element={<Login setLoggedInUser={setLoggedInUser} />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;