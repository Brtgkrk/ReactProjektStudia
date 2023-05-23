import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import NavigationBar from "./NavigationBar";
// Types
import { User } from "../types/User";
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
    value = "",
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
    const dataInfoRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
            );
            const data = await response.json();
            let cUser = username;
            if (username === undefined) cUser = loggedInUser;
            setCurrentUser(data.find((user: { username: string | undefined; })=> user.username === cUser));
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
        if (changingFieldType === "Email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (editedValue)
            isValid = emailRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage("Wprowadź poprawny adres email");
            }
        } else if (changingFieldType === "Telefon") {
            const phoneRegex = /^\d{9}$/;
            if (editedValue)
            isValid = phoneRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage("Wprowadź poprawny numer telefonu (9 cyfr)");
            }
        } else if (changingFieldType === "Strona") {
            const websiteRegex = /^[^\s]+\.[^\s]+$/;
            if (editedValue)
            isValid = websiteRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage("Wprowadź poprawny adres strony internetowej");
            }
        } else if (changingFieldType === "Kod pocztowy") {
            const zipcodeRegex = /^\d{2}-\d{3}$/;
            if (editedValue)
            isValid = zipcodeRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage("Wprowadź poprawny kod pocztowy (xx-xxx)");
            }
        } else if (changingFieldType === "Szerokość geograficzna" || changingFieldType === "Długość geograficzna") {
            const coordinateRegex = /^-?\d+(?:\.\d+)?$/;
            if (editedValue)
            isValid = coordinateRegex.test(editedValue);
            if (!isValid) {
            setErrorMessage(
                "Wprowadź poprawną wartość współrzędnej (liczba zmiennoprzecinkowa z kropką)"
            );
            }
        }
        
        if (isValid && dataInfoRef.current) {
            if (changingFieldType === "Imie i nazwisko" && currentUser && editedValue) currentUser.name = editedValue;
            if (changingFieldType === "Email" && currentUser && editedValue) currentUser.email = editedValue;
            if (changingFieldType === "Telefon" && currentUser && editedValue) currentUser.phone = editedValue;
            if (changingFieldType === "Strona" && currentUser && editedValue) currentUser.website = editedValue;
            if (changingFieldType === "Ulica" && currentUser && editedValue) currentUser.address.street = editedValue;
            if (changingFieldType === "Mieszkanie" && currentUser && editedValue) currentUser.address.suite = editedValue;
            if (changingFieldType === "Miasto" && currentUser && editedValue) currentUser.address.city = editedValue;
            if (changingFieldType === "Kod pocztowy" && currentUser && editedValue) currentUser.address.zipcode = editedValue;
            if (changingFieldType === "Szerokość geograficzna" && currentUser && editedValue) currentUser.address.geo.lat = parseFloat(editedValue);
            if (changingFieldType === "Długość geograficzna" && currentUser && editedValue) currentUser.address.geo.lng = parseFloat(editedValue);
            if (changingFieldType === "Nazwa firmy" && currentUser && editedValue) currentUser.company.name = editedValue;
            if (changingFieldType === "Slogan" && currentUser && editedValue) currentUser.company.catchPhrase = editedValue;
            if (changingFieldType === "BS" && currentUser && editedValue) currentUser.company.bs = editedValue;
            setIsEditing(false);
            setEditedValue(value);
            setErrorMessage("");
            if (editedValue) {
                dataInfoRef.current.innerText = `${changingFieldType} pomyślnie zmienione na ${editedValue}`;
                dataInfoRef.current.style.color = "green";
            }
            else {
                dataInfoRef.current.innerText = `Wprowadź proszę jakąś wartość`;
                dataInfoRef.current.style.color = "red";
            }
        }
    };
    
    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedValue(value);
        setErrorMessage("");
    };

    const handleDataClick = (type : string) => {
        return () => {
            if (currentUser?.username === loggedInUser) {
                setChangingFieldType(type);
                //console.log(`Zmiana wybranego pola na ${changingFieldType}`);
                setIsEditing(true);
                //window.scrollTo({ top: 0, behavior: "smooth" });
                if (dataInfoRef.current) dataInfoRef.current.innerText = ``;
            }
        }
    }

    return (
        <div>
            <NavigationBar loggedInUser={loggedInUser}/>
            {(currentUser ?
                <div className="user-container">
                    <h1>{currentUser?.name}</h1>
                    {(currentUser?.username === loggedInUser) ? <div className="info-edit">
                        <p className="p-green">
                            Istnieje możliwość edycji danych
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
                            placeholder="wprowadz wartosc"
                            type={changingFieldType === "email" ? "email" : "text"}
                            value={editedValue}
                            onChange={handleInputChange}
                        /><div></div>
                        <button onClick={handleSaveClick} className="btn-save">Zapisz</button>
                        <button onClick={handleCancelClick} className="btn-red">Anuluj</button>
                        {errorMessage && <p className="msg-err">{errorMessage}</p>}
                        </div>
                    ) : (
                        <div>
                        <span>{value}</span>
                        </div>
                    )}
                    <p ref={dataInfoRef}></p>
                        <div>
                            <h2>Dane personalne:</h2>
                            <p onClick={handleDataClick("Imie i nazwisko")} className="p-user">Imie i nazwisko: {currentUser?.name}</p>
                            <p onClick={handleDataClick("Email")} className="p-user">Email: {currentUser?.email}</p>
                            <p onClick={handleDataClick("Telefon")} className="p-user">Telefon: {currentUser?.phone}</p>
                            <p onClick={handleDataClick("Strona")} className="p-user">Strona: {currentUser?.website}</p>
                        </div>
                        <div>
                            <h2>Adres:</h2>
                            <p onClick={handleDataClick("Ulica")} className="p-user">Ulica: {currentUser?.address.street}</p>
                            <p onClick={handleDataClick("Mieszkanie")} className="p-user">Mieszkanie: {currentUser?.address.suite}</p>
                            <p onClick={handleDataClick("Miasto")} className="p-user">Miasto: {currentUser?.address.city}</p>
                            <p onClick={handleDataClick("Kod pocztowy")} className="p-user">Kod pocztowy: {currentUser?.address.zipcode}</p>
                            <p onClick={handleDataClick("Szerokość geograficzna")} className="p-user">Szerokość geograficzna: {currentUser?.address.geo.lat}</p>
                            <p onClick={handleDataClick("Długość geograficzna")} className="p-user">Długość geograficzna: {currentUser?.address.geo.lng}</p>
                        </div>
                        <div>
                            <h2>Firma:</h2>
                            <p onClick={handleDataClick("Nazwa firmy")} className="p-user">Nazwa firmy: {currentUser?.company.name}</p>
                            <p onClick={handleDataClick("Slogan")} className="p-user">Slogan: {currentUser?.company.catchPhrase}</p>
                            <p onClick={handleDataClick("BS")} className="p-user">BS: {currentUser?.company.bs}</p>
                        </div>

                        <div className="post-container">
                            <h2>Posty użytkownika {currentUser?.username}:</h2>
                                {posts.map((post) => {
                                    //const user = users.find((user) => user.id === post.userId);
                                    return (
                                        <div key={post.id} className="post album-container" onClick={() => navigate(`/posty/${post.id}`)}>
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
            :
            <h1 className="msg-err user-err">Użytkownik {username} nie istnieje!</h1>
            )}
        </div>
    );
}

export default UserPage;