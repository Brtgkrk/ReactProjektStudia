import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// Styles
import "../styles/LoginPage.css";

type LoginProps = {
  setLoggedInUser: React.Dispatch<React.SetStateAction<string | null>>;
};

const Login: React.FC<LoginProps> = ({ setLoggedInUser }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const loginInfoRef = useRef<HTMLParagraphElement>(null);

  const handleLogin = async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?username=${username}`
    );
    const users = await response.json();
    if (users.length > 0) {
      //setLoggedInUser(users[0].name);
      localStorage.setItem('loggedInUser', JSON.stringify(users[0].username));
      console.log(`Zapisywanie użytkownika ${users[0].username} do pamięci lokalnej`);
      navigate("/");
    } else if (loginInfoRef.current) {
      loginInfoRef.current.innerText = `Użytkownik ${username} nie istnieje!`;
      loginInfoRef.current.style.color = "red";
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="app-title">React Forum</h1>
        <p>Użytkownik testowy: Bret</p>
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
        <p className="photos-info" ref={loginInfoRef}></p>
      </div>
    </div>
  );
};

export default Login;