import React, { useEffect, useRef, useState } from "react";
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
    const [photoOldestOrder, setPhotoOldestOrder] = useState<Boolean>(true);
    const sortButtonRef = useRef<HTMLButtonElement>(null);
    const photoInfoRef = useRef<HTMLParagraphElement>(null);

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
    
            const authorResponse = await fetch(
            `https://jsonplaceholder.typicode.com/users/${albumData.userId}`
            );
            const authorData = await authorResponse.json();
            setAuthor(authorData);
        }

        fetchData();

    }, []);

    const handleAddPhoto = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const fileInput = document.querySelector<HTMLInputElement>('#file-input');

        if (albumId !== undefined && fileInput && fileInput.files && fileInput.files.length > 0)
        {
            let photoTitle;
            if (newPhoto.title != "") photoTitle = newPhoto.title;
            else photoTitle = fileInput.files[0].name;
            const photo = {
                id: photos.length + 1,
                albumId: parseInt(albumId),
                title: photoTitle,
                url: URL.createObjectURL(fileInput.files[0]),
                thumbnailUrl: URL.createObjectURL(fileInput.files[0]),
            }
            setPhotos([...photos, photo]);
            if(photoInfoRef.current)
            {
                photoInfoRef.current.innerText = `Zdjęcie ${photo.title} zostało poprawnie dodane do albumu ${currentAlbum?.title}`;
                photoInfoRef.current.style.color = "green";
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPhoto((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeletePhoto = async (id: number, userName: string) => {
        if (loggedInUser === undefined || loggedInUser === null) {
            alert("Musisz się zalogować, aby usunąć zdjęcie!"); // Just in case
            return;
    }

    const photo = photos.find(photo => photo.id === id);
        if (photo)
        {
            const album = albums.find(album => album.id == photo.albumId);
            if (album)
            {
                if (albumAuthor?.username !== loggedInUser) {
                    alert("Nie masz uprawnień do usunięcia tego zdjęcie!"); // Just in case
                    return;
                }
                await deletePhoto(id);
            }
        }
    };

    const deletePhoto = (id: number) => {
        setPhotos(photos.filter((photo) => photo.id !== id));
    };

    const handleSortButton = () => {
        if (sortButtonRef.current) {
            (photoOldestOrder ?
                sortButtonRef.current.innerText = "Sortuj od najstarszych"
                :
                sortButtonRef.current.innerText = "Sortuj od najnowszych"
            )
            setPhotoOldestOrder(!photoOldestOrder);
        }
    }

    const albumUserId = users.find((user) => user.name === loggedInUser)?.id;

    return (
        <div>
            <NavigationBar loggedInUser={loggedInUser}/>
            {(albumAuthor?.name ? <>
            <div className="album-center">
                Album: <b>{currentAlbum?.title}</b>, autor: <b>{albumAuthor?.name}</b>
            </div>
            
            {(loggedInUser === albumAuthor?.username) ?
                <form onSubmit={handleAddPhoto}>
                    <input
                    type="text"
                    name="title"
                    placeholder="Wpisz nazwe zdjecia"
                    value={newPhoto.title}
                    onChange={handleInputChange}
                    className="input-photo"
                    />

                    <label htmlFor="file-input" className="file-input-button">
                    Wybierz plik
                    </label>
                    <input id="file-input" type="file" accept="image/*" onChange={handleInputChange} />

                    <button type="submit">Dodaj zdjęcie</button>
                </form>
            : null}
            <p ref={photoInfoRef} className="p-info"></p>
            <button ref={sortButtonRef} onClick={handleSortButton} className="btn-sort">Sortuj od najnowszych</button>
            <div className="post-container">
                {
                    <div className="album-photo-container"> 
                        {
                            photoOldestOrder ? (
                                photos.map(photo => (
                                <div className="album-photo-div" key={photo.id}>
                                    <img alt={photo.title} className="album-photo" src={photo.thumbnailUrl}/>
                                    <p>{photo.title}</p>
                                    {albumAuthor?.username === loggedInUser ? (
                                    <button onClick={() => handleDeletePhoto(photo.id, loggedInUser)} className="btn-red btn-del">
                                        Usuń zdjęcie
                                    </button>
                                    ) : null}
                                </div>
                                ))
                            ) : (
                                photos.slice(0).reverse().map(photo => (
                                <div className="album-photo-div" key={photo.id}>
                                    <img alt={photo.title} className="album-photo" src={photo.thumbnailUrl}/>
                                    <p>{photo.title}</p>
                                    {albumAuthor?.username === loggedInUser ? (
                                    <button onClick={() => handleDeletePhoto(photo.id, loggedInUser)} className="btn-red btn-del">
                                        Usuń zdjęcie
                                    </button>
                                    ) : null}
                                </div>
                                ))
                            )
                        } 
                    </div>
                }
            </div>
            </>:
            <h1 className="msg-err user-err">Album o id {albumId} nie istnieje!</h1>
            )}
        </div>
    );
}

export default PhotosPage;