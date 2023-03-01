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

type PhotosSearchPageProps = {
    loggedInUser: string;
};

const PhotosSearchPage: React.FC<PhotosSearchPageProps> = ({ loggedInUser }) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [photoId, setPhotoId] = useState('');
    const [albumId, setAlbumId] = useState('');
    const [showPhoto, setShowPhoto] = useState(false);
    const [showAlbumPhotos, setShowAlbumPhotos] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo>();
    const [selectedAlbumPhotos, setSelectedAlbumPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/photos"
            );
            const data = await response.json();
            setPhotos(data);
        };
    fetchPhotos();
    }, []);

    const handleButtonClick = () => {
        setShowPhoto(false);
        setShowAlbumPhotos(false);
        setSelectedPhoto(undefined);
        setSelectedAlbumPhotos([]);

        if (photoId) {
            const photo = photos.find((photo) => photo.id === parseInt(photoId));
            if (photo)
            {
                setShowPhoto(true);
                setSelectedPhoto(photo);
            }
        }
        else if (albumId) {
            const albumPhotos = photos.filter((photo) => photo.albumId === parseInt(albumId));
            if (albumPhotos.length > 0) {
                setShowAlbumPhotos(true);
                setSelectedAlbumPhotos(albumPhotos);
            }
        }
    }

    return (
        <div>
            <NavigationBar loggedInUser={loggedInUser}/>
            <h3>Search Photo</h3>
            <div>
            <div>
                <label htmlFor="photoId">ID zdjęcia:</label>
                <input type="number" id="photoId" value={photoId} onChange={(e) => setPhotoId(e.target.value)} />
            </div>
            <div>
                <label htmlFor="albumId">ID albumu:</label>
                <input type="number" id="albumId" value={albumId} onChange={(e) => setAlbumId(e.target.value)} />
            </div>
            <button onClick={handleButtonClick}>Pokaż zdjęcie</button>

            {showPhoto && (
                <div>
                <h2>Zdjęcie o ID: {selectedPhoto?.id}</h2>
                <img src={selectedPhoto?.url} alt={selectedPhoto?.title} />
                </div>
            )}

            {showAlbumPhotos && (
                <div>
                <h2>Zdjęcia z albumu o ID: {selectedAlbumPhotos[0].albumId}</h2>
                {selectedAlbumPhotos.map((photo) => (
                    <div key={photo.id}>
                    <img src={photo.url} alt={photo.title} />
                    </div>
                ))}
                </div>
            )}
            </div>
        </div>
    );
}

export default PhotosSearchPage;