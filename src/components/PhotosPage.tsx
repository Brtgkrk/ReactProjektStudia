import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import NavigationBar from "./NavigationBar";
// Types
import { User } from "../types/User";
import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
// CSS

type PhotosPageProps = {
    loggedInUser: string;
};

const PhotosPage: React.FC<PhotosPageProps> = ({ loggedInUser }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const { albumId } = useParams();
    const [currentAlbum, setAlbum] = useState<Album | undefined>(undefined);
    const [albumAuthor, setAuthor] = useState<User[]>([]);
    //const [albumAuthor, setAuthor] = useState<User[] | undefined>();
    //const [currentAlbum, setAlbum] = useState<Album[] | undefined>();

useEffect(() => {
    const fetchPhotos = async () => {
        const response: Response = await fetch(
            "https://jsonplaceholder.typicode.com/photos"
        );
        const data: Photo[] = await response.json();
        data.map(p => console.log(p.title));
        console.log("curent albumid: " + albumId);
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
  
        const authorResponse = await fetch(
          `https://jsonplaceholder.typicode.com/users/${albumData.userId}`
        );
        const authorData = await authorResponse.json();
        setAuthor(authorData);
    }

    /*const checkAlbumAuthor = async () => {
        if(albumId !== undefined)
        {
            const currentAlbum = albums.find( album => album.id == parseInt(albumId));
            const data = users.find( user => user.id === currentAlbum?.userId)
            if (data) {
                setAuthor([data]);
            }
            if (currentAlbum) {
                setAlbum([currentAlbum]);
            }
        }
    }
    checkAlbumAuthor();*/

}, []);

//const albumTitle = currentAlbum?.title;
//const authorName = albumAuthor?.name;

return (
    <div>
        <NavigationBar loggedInUser={loggedInUser}/>

        <h1>Album
            {currentAlbum?.title}
        </h1>

        <div className="post-container">
            {
                <ul>
                {photos.map(photo => (
                  <li key={photo.id}>
                    <img src={photo.thumbnailUrl} alt={photo.title} />
                    <p>{photo.title}</p>
                  </li>
                ))}
              </ul>
            }
        </div>

    </div>
);

}

export default PhotosPage;