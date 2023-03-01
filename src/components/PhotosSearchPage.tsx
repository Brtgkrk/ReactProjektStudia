import React, { useEffect, useState, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import NavigationBar from "./NavigationBar";
// Types
import { User } from "../types/User";
import { Photo } from "../types/Photo";
import { Album } from "../types/Album";
// CSS
import "../styles/PhotosPage.css"
import "../styles/UserList.css"
import "../styles/PostPage.css";

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
    const navigate = useNavigate();

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

    const photosInfoRef = useRef<HTMLParagraphElement>(null);

    const handleButtonClick = () => {
        setShowPhoto(false);
        setShowAlbumPhotos(false);
        setSelectedPhoto(undefined);
        setSelectedAlbumPhotos([]);
        if(photosInfoRef.current) {
            photosInfoRef.current.innerText = "";
            photosInfoRef.current.style.color = 'black';
        }

        if (photoId) {
            let photo;
            if (albumId) { // Jezeli zostalo wpisane id zdjecia i id albumu, szukaj zdjecia o danym id i id albumu
                photo = photos.find((photo) => photo.id === parseInt(photoId) && photo.albumId === parseInt(albumId));
            }
            else { // Jezeli wpisano tylko id zdjecia, szukaj zdjecie o danym id
                photo = photos.find((photo) => photo.id === parseInt(photoId));
            }
            if (photo) {
                setShowPhoto(true);
                setSelectedPhoto(photo);
            }
            else if(photosInfoRef.current && albumId) {
                photosInfoRef.current.innerText = 'Nie znaleziono żadnego zdjęcia w podanym albumie!';
                photosInfoRef.current.style.color = 'red';
            }
            else if(photosInfoRef.current) {
                photosInfoRef.current.innerText = 'Nie znaleziono żadnego zdjęcia!';
                photosInfoRef.current.style.color = 'red';
            }
        }
        else if (albumId) { // Jezeli zostalo wpisane tylko id albumu, szukaj wszystkich zdjec z danego albumu
            const albumPhotos = photos.filter((photo) => photo.albumId === parseInt(albumId));
            if (albumPhotos.length > 0) {
                setShowAlbumPhotos(true);
                setSelectedAlbumPhotos(albumPhotos);
            }
            else if(photosInfoRef.current) {
                photosInfoRef.current.innerText = 'Nie znaleziono żadnego albumu!';
                photosInfoRef.current.style.color = 'red';
            }
        }
    }

    return (
        <div>
            <NavigationBar loggedInUser={loggedInUser}/>
            <div className="photos-search-container">
                <h2>Wyszukiwarka zdjęć</h2>
                <div>
                <div className="number-input">
                    <input type="number" id="photoId" placeholder="Podaj ID zdjęcia" value={photoId} onChange={(e) => setPhotoId(e.target.value)} />
                </div>
                <div className="number-input">
                    <input type="number" id="albumId" placeholder="Podaj ID albumu" value={albumId} onChange={(e) => setAlbumId(e.target.value)} />
                </div>
                <button className="photos-search-button" onClick={handleButtonClick}>Pokaż zdjęcie</button>
                <p className="photos-info" ref={photosInfoRef}></p>
            </div>
            {showPhoto && (
                <div className="album-single-photo-div">
                    <p>Zdjęcie o ID: <b>{selectedPhoto?.id}</b></p>
                    <img className="album-single-photo" src={selectedPhoto?.url} alt={selectedPhoto?.title} />
                    <p>{selectedPhoto?.title}</p>
                </div>
            )}

            {showAlbumPhotos && (
                <div className="album-photo-container photos-search-container">
                    <p>Zdjęcia z albumu o ID: <b>{selectedAlbumPhotos[0].albumId}</b></p>
                    <button className="goto-album-button" onClick={() => navigate(`/album/${selectedAlbumPhotos[0].albumId}`)}>Przejdź do albumu</button>
                    {selectedAlbumPhotos.map((photo) => (
                        <div className="album-photo-div" key={photo.id}>
                            <img className="album-photo" src={photo.url} alt={photo.title} />
                            <p>{photo.title}</p>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
}

export default PhotosSearchPage;