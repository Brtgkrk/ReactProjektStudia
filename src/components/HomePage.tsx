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
    const [searchUserName, setSearchText] = useState('');
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

    const handleSearchInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchText(event?.target.value);
    }

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchUserName.toLowerCase()));
    const filteredAlbums = albums.filter(album => filteredUsers.some(user => user.id === album.userId));

    return (
        <div>
            <NavigationBar loggedInUser={loggedInUser}/>
            <div className="post-container">
                <h2>Wszystkie albumy ze zdjęciami</h2>
                <input className="" type="text" value={searchUserName} onChange={handleSearchInputChange} placeholder="Wyszukaj po twórcy" />
                {filteredAlbums.map((album) => {
                    const user = users.find((user) => user.id === album.userId);
                    const albumPhotos = photos.filter((photo) => album.id === photo.albumId);
                    let maxPhotos = 10; // Liczba zdjec ograniczona aby przyspieszyc ladowanie aplikacji
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
                                        albumPhotos.map((albumPhoto, index) => {
                                            const maxPhotosLeft = maxPhotos - index;
                                            return maxPhotosLeft > 0 && (
                                                <div key={albumPhoto.id}>
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