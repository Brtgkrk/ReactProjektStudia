import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import NavigationBar from "./NavigationBar";
// Types
import { User } from "../types/User";
// CSS
import "../styles/PhotosPage.css"
import "../styles/UserList.css"

type UserListProps = {
  loggedInUser : string;
}

const UserList: React.FC<UserListProps> = ({ loggedInUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const users = await response.json();
      setUsers(users);
    };
    fetchUsers();
  }, []);
  const navigate = useNavigate();

  const handleSearchInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchText(event?.target.value);
  }

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));
  const userElements = filteredUsers.map(user => (
    <div key={user.id} className="list-user" onClick={() => navigate(`/uzytkownicy/${user.username}`)}>
      <p>Nazwa użytkownika: {user.username}</p>
      <h4>{user.name}</h4>
    </div>
  ));

  return (
    <div className="album-center">
        <NavigationBar loggedInUser={loggedInUser}/>
        <h2>Wszyscy użytkownicy:</h2>
        <input className="" type="text" value={searchText} onChange={handleSearchInputChange} placeholder="Wyszukaj użytkownika" />
        {userElements}
    </div>
  );
};

export default UserList;
