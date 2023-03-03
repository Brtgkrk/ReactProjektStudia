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
import { Post } from "../types/Post";
// CSS
import "../styles/UserPage.css";
import "../styles/PostPage.css";

type UserPageProps = {
    loggedInUser: string;
    label?: string;
    value?: string;
    fieldType?: string;
    onSave?: (newValue: string) => void;
};

const UserPage: React.FC<UserPageProps> = ({ 
    loggedInUser, 
    label,
    value,
    fieldType,
    onSave
    }) => {
    const [currentUser, setCurrentUser] = useState<User>();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    const navigate = useNavigate();
    const { username } = useParams();

    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);
    const [errorMessage, setErrorMessage] = useState("");

    const [changingFieldType, setChangingFieldType] = useState("");

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
            );
            const data = await response.json();
            setCurrentUser(data.find((user: { username: string | undefined; })=> user.username === username));
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
            );
            const data: Post[] = await response.json();
            const currentUserPosts = data.filter((post) => post.userId === currentUser?.id);
            setPosts(currentUserPosts);
        };

        const fetchAlbums = async () => {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/albums"
            );
            const data: Album[] = await response.json();
            const currentUserAlbums = data.filter((album) => album.userId === currentUser?.id);
            setAlbums(currentUserAlbums);
        };

        fetchPosts();
        fetchAlbums();
    },[currentUser])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedValue(event.target.value);
    };
    
    const handleSaveClick = () => {
        if (currentUser?.username != loggedInUser) return;
        let isValid = true;
        if (changingFieldType === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (editedValue)
            isValid = emailRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage("Wprowadź poprawny adres email");
            }
        } else if (changingFieldType === "phone") {
            const phoneRegex = /^\d{9}$/;
            if (editedValue)
            isValid = phoneRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage("Wprowadź poprawny numer telefonu (9 cyfr)");
            }
        } else if (changingFieldType === "website") {
            const websiteRegex = /^[^\s]+\.[^\s]+$/;
            if (editedValue)
            isValid = websiteRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage("Wprowadź poprawny adres strony internetowej");
            }
        } else if (changingFieldType === "zipcode") {
            const zipcodeRegex = /^\d{2}-\d{3}$/;
            if (editedValue)
            isValid = zipcodeRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage("Wprowadź poprawny kod pocztowy (xx-xxx)");
            }
        } else if (changingFieldType === "latitude" || changingFieldType === "longitude") {
            const coordinateRegex = /^-?\d+(?:\.\d+)?$/;
            if (editedValue)
            isValid = coordinateRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage(
                "Wprowadź poprawną wartość współrzędnej (liczba zmiennoprzecinkowa)"
            );
            }
        }
        
        if (isValid) {
            if (changingFieldType === "email" && currentUser && editedValue) currentUser.email = editedValue;
            if (changingFieldType === "username" && currentUser && editedValue) currentUser.username = editedValue;
            if (changingFieldType === "phone" && currentUser && editedValue) currentUser.phone = editedValue;
            if (changingFieldType === "website" && currentUser && editedValue) currentUser.website = editedValue;
            setIsEditing(false);
            setEditedValue(value);
            setErrorMessage("");
        }
    };
    
    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedValue(value);
        setErrorMessage("");
    };

    const handleDataClick = (type : string) => {
        return () => {
            setChangingFieldType(type);
            console.log(`Zmiana wybranego pola na ${changingFieldType}`);
            setIsEditing(true);
        }
    }

    //changingFieldType = "username";

    return (
        <div>
            <NavigationBar loggedInUser={loggedInUser}/>
            <div className="user-container">
                <h1>{currentUser?.name}</h1>
                {(currentUser?.username === loggedInUser) ? <div className="info-edit">
                    <p className="p-green">
                        istnieje możliwość edycji danych
                    </p>
                    <p className="p-green">
                        Wystarczy kliknąć na dane do zmiany
                    </p>
                </div> : null}
                <div className="user-details">


                <label>{label}</label>
                {isEditing ? (
                    <div>
                    <input
                        type={changingFieldType === "email" ? "email" : "text"}
                        value={editedValue}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleSaveClick} className="btn-save">Zapisz</button>
                    <button onClick={handleCancelClick} className="btn-red">Anuluj</button>
                    {errorMessage && <p>{errorMessage}</p>}
                    </div>
                ) : (
                    <div>
                    <span>{value}</span>
                    </div>
                )}

                    <div>
                        <h2>Dane personalne:</h2>
                        <p onClick={handleDataClick("username")} className="p-user">Nazwa użytkownika: {currentUser?.username}</p>
                        <p onClick={handleDataClick("email")} className="p-user">Email: {currentUser?.email}</p>
                        <p onClick={handleDataClick("phone")} className="p-user">Telefon: {currentUser?.phone}</p>
                        <p onClick={handleDataClick("website")} className="p-user">Strona: {currentUser?.website}</p>
                    </div>
                    <div>
                        <h2>Adres:</h2>
                        <p>Street: {currentUser?.address.street}</p>
                        <p>Suite: {currentUser?.address.suite}</p>
                        <p>City: {currentUser?.address.city}</p>
                        <p>Zipcode: {currentUser?.address.zipcode}</p>
                        <p>Latitude: {currentUser?.address.geo.lat}</p>
                        <p>Longitude: {currentUser?.address.geo.lng}</p>
                    </div>
                    <div>
                        <h2>Firma:</h2>
                        <p>Name: {currentUser?.company.name}</p>
                        <p>Catchphrase: {currentUser?.company.catchPhrase}</p>
                        <p>BS: {currentUser?.company.bs}</p>
                    </div>



                    <div className="post-container">
                        <h2>Posty użytkownika {currentUser?.username}:</h2>
                            {posts.map((post) => {
                                //const user = users.find((user) => user.id === post.userId);
                                return (
                                    <div key={post.id} className="post">
                                        <div className="post-header">
                                            <div className="post-author">{currentUser?.name}</div>
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
                    <h2>Albumy użytkownika {currentUser?.username}:</h2>
                    <div className="post-container">
                        {albums.map((album) => {
                            return (
                                <div 
                                    key={album.id} 
                                    className="post album-container" 
                                    onClick={() => navigate(`/album/${album.id}`)}
                                    >
                                    <div className="post-header">
                                        <div className="post-author">twórca: <b>{currentUser?.name}</b></div>
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

