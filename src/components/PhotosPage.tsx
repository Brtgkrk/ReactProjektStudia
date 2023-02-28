import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import NavigationBar from "./NavigationBar";
// Types
import { User } from "../types/User";
import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
// CSS
import "../styles/PhotosPage.css"

type PhotosPageProps = {
    loggedInUser: string;
};

const PhotosPage: React.FC<PhotosPageProps> = ({ loggedInUser }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const { albumId } = useParams();
    const [currentAlbum, setAlbum] = useState<Album | undefined>(undefined);
    const [albumAuthor, setAuthor] = useState<User | undefined>(undefined);
    const [newPhoto, setNewPhoto] = useState<Photo>({ albumId: 0, id: 0, title: "", url: "", thumbnailUrl: ""});

useEffect(() => {
    const fetchPhotos = async () => {
        const response: Response = await fetch(
            "https://jsonplaceholder.typicode.com/photos"
        );
        const data: Photo[] = await response.json();
        //data.map(p => console.log(p.title));
        console.log("curent albumId: " + albumId);
        if(albumId !== undefined)
        {
            
            setPhotos(data.filter((photo) => photo.albumId == parseInt(albumId)));
        }
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

    async function fetchData() {
        const albumResponse = await fetch(
          `https://jsonplaceholder.typicode.com/albums/${albumId}`
        );
        const albumData = await albumResponse.json();
        setAlbum(albumData);
        console.log("curent albumData: " + albumData);
  
        const authorResponse = await fetch(
          `https://jsonplaceholder.typicode.com/users/${albumData.userId}`
        );
        const authorData = await authorResponse.json();
        setAuthor(authorData);
        console.log("curent authorData: " + authorData);
    }

    fetchData();

}, []);

/*const handleAddPhoto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const highestId = Math.max(...photos.map((p) => p.id));
    const newId = highestId + 1;*/

    const handleAddPhoto = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fileInput = document.querySelector<HTMLInputElement>('#file-input');

    if (albumId !== undefined && fileInput && fileInput.files && fileInput.files.length > 0)
    {
        const newPhoto = {
            id: photos.length + 1,
            albumId: parseInt(albumId),
            title: fileInput.files[0].name,
            url: URL.createObjectURL(fileInput.files[0]),
            thumbnailUrl: URL.createObjectURL(fileInput.files[0]),
        }
        setPhotos([...photos, newPhoto]);
    }

    /*if (newPhoto.title.trim() && newPhoto.url.trim() && newId) {
        setPhotos([...photos, newPhoto]);
        setNewPhoto({ albumId: 0, id: 0, title: "", url: "", thumbnailUrl: "" });
    }*/
}

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPhoto((prev) => ({ ...prev, [name]: value }));
  };

return (
    <div>
        <NavigationBar loggedInUser={loggedInUser}/>

        <div className="album-center">
            Album: <b>{currentAlbum?.title}</b>, autor: <b>{albumAuthor?.name}</b>
        </div>

        <form onSubmit={handleAddPhoto}>
            <input
            type="text"
            name="title"
            placeholder="Wpisz nazwe zdjecia"
            value={newPhoto.title}
            onChange={handleInputChange}
            />

        <input id="file-input" type="file" accept="image/*" onChange={handleInputChange} />

        <button type="submit">Dodaj zdjęcie</button>
        </form>

        <div className="post-container">
            {
                <div className="album-photo-container">
                {photos.map(photo => (
                  <div className="album-photo-div" key={photo.id}>
                    <img alt={photo.title} className="album-photo" src={photo.thumbnailUrl}/>
                    <p>{photo.title}</p>
                  </div>
                ))}
              </div>
            }
        </div>

    </div>
);

}

export default PhotosPage;