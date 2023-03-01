import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Components
import NavigationBar from "./NavigationBar";
// Types
import { User } from "../types/User";
import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
// CSS
import "../styles/UserPage.css";
import "../styles/PostPage.css";
import { Post } from "../types/Post";

type UserPageProps = {
    loggedInUser: string;
};

const UserPage: React.FC<UserPageProps> = ({ loggedInUser }) => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
    const { username } = useParams();

useEffect(() => {
    const fetchUsers = async () => {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        setUsers(data);
    };

    const fetchAlbums = async () => {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/albums"
        );
        const user = users.find((user) => user.username === username);
        const data: Album[] = await response.json();
        const currentUserAlbums = data.filter((album) => album.userId === user?.id);
        setAlbums(data);
        //console.log("all posts: " + data + "\n current user post: " + currentUserAlbums + "current user: " + user?.id + "all users " + users);
    };

    const fetchPhotos = async () => {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/photos"
        );
        const data = await response.json();
        setPhotos(data);
    };

    fetchUsers();
    fetchAlbums();
    fetchPhotos();
}, []);

useEffect(() => {
    const fetchPosts = async () => {
        const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
        );
        const user = users.find((user) => user.username === username);
        console.log("current user is " + user + "\n all users: " + users);
        const data: Post[] = await response.json();
        const currentUserPosts = data.filter((post) => post.userId === user?.id);
        setPosts(currentUserPosts);
    };
    fetchPosts();
})

const user = users.find((user) => user.username === username);

return (
    <div>
        <NavigationBar loggedInUser={loggedInUser}/>
        <div>Strona użytkownika: {user?.username}</div>

        <div className="user-container">
      <h1>{user?.name}</h1>
      <div className="user-details">
        <div>
            <h2>Dane personalne:</h2>
            <p>Username: {user?.username}</p>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone}</p>
            <p>Website: {user?.website}</p>
        </div>
        <div>
            <h2>Adres:</h2>
            <p>Street: {user?.address.street}</p>
            <p>Suite: {user?.address.suite}</p>
            <p>City: {user?.address.city}</p>
            <p>Zipcode: {user?.address.zipcode}</p>
            <p>Latitude: {user?.address.geo.lat}</p>
            <p>Longitude: {user?.address.geo.lng}</p>
        </div>
        <div>
            <h2>Firma:</h2>
            <p>Name: {user?.company.name}</p>
            <p>Catchphrase: {user?.company.catchPhrase}</p>
            <p>BS: {user?.company.bs}</p>
        </div>
            <div className="post-container">
            <h2>Posty użytkownika {user?.username}:</h2>
                {posts.map((post) => {
                    //const user = users.find((user) => user.id === post.userId);
                    return (
                        <div key={post.id} className="post">
                            <div className="post-header">
                                <div className="post-author">{user?.name}</div>
                            </div>
                            <div className="post-body">
                                <div className="post-title">{post.title}</div>
                                <div className="post-text">{post.body}</div>
                                <div className="post-comments">
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <h2>Albumy użytkownika {user?.username}:</h2>
            <div className="post-container">
            {albums.map((album) => {
                const user = users.find((user) => user.id === album.userId);
                const albumPhotos = photos.filter((photo) => album.id === photo.albumId);
                return (
                    <div 
                        key={album.id} 
                        className="post album-container" 
                        onClick={() => navigate(`/album/${album.id}`)}
                        >
                        <div className="post-header">
                            <div className="post-author">twórca: <b>{user?.name}</b></div>
                        </div>
                        <div className="album-body">
                            <div className="post-title">album: <b>{album.title}</b></div>
                            
                        </div>
                    </div>
                );
            })}
        </div>
        </div>
      </div>

      
    </div>
);

}

export default UserPage;

