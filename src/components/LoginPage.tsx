import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./UserList";
import "../styles/LoginPage.css";

type LoginProps = {
  setLoggedInUser: React.Dispatch<React.SetStateAction<string | null>>;
};

const Login: React.FC<LoginProps> = ({ setLoggedInUser }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?username=${username}`
    );
    const users = await response.json();
    if (users.length > 0) {
      setLoggedInUser(users[0].name);
      navigate("/");
    } else {
      alert("Użytkownik " + username + " nie istnieje!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="app-title">React Forum</h1>
        <input
          id="username-input"
          type="text"
          value={username}
          placeholder="Nazwa użytkownika"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button id="login-button" onClick={handleLogin}>
          Zaloguj się
        </button>
      </div>
    </div>
  );
};

export default Login;
