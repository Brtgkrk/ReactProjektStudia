import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Components
import NavigationBar from "./NavigationBar";
// Types
import { User } from "../types/User";
import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
// CSS
import "../styles/PostPage.css";
import "../styles/HomePage.css";

type HomePageProps = {
    loggedInUser: string;
};

const HomePage: React.FC<HomePageProps> = ({ loggedInUser }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();

useEffect(() => {
    const fetchPhotos = async () => {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/photos"
        );
        const data = await response.json();
        setPhotos(data);
    };

    const fetchAlbums = async () => {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/albums"
        );
        const data = await response.json();
        setAlbums(data);
    };

    const fetchUsers = async () => {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        setUsers(data);
      };

    fetchPhotos();
    fetchAlbums();
    fetchUsers();
}, []);

return (
    <div>
        <NavigationBar loggedInUser={loggedInUser}/>
        <div>Home Page</div>

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
                            <div>{
                                albumPhotos.map((albumPhoto) => {
                                    return(
                                        <div>
                                            <img src={albumPhoto.thumbnailUrl} alt={albumPhoto.title} id="album-photo"/>
                                        </div>
                                    );
                                })
                            }</div>
                        </div>
                    </div>
                );
            })}
        </div>

    </div>
);

}

export default HomePage;