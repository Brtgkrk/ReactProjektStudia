import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import NavigationBar from "./NavigationBar";
// Types
import { User } from "../types/User";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";
// CSS
import "../styles/PhotosPage.css"
import "../styles/CommentsPage.css"

type PhotosPageProps = {
    loggedInUser: string;
};

const CommentsPage: React.FC<PhotosPageProps> = ({ loggedInUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserPost, setCurrentUserPost] = useState<User>();
    const [post, setPost] = useState<Post | undefined>(undefined);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<Comment>({ postId: 0, id: 0, name: "", email: "", body: ""});
    const { postId } = useParams();
    const nameRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const commentInfoRef = useRef<HTMLParagraphElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [loggedInUserData, setLoggedInUserData] = useState<User>();

    const fetchUsers = async () => {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        return data;
    };

    const fetchCurrentUser = (users : User[], post : Post) => {
        const currentUserPost = users.find(user => user.id === post?.userId)
        console.log("all users: ");
        users.map(user => console.log(user.name));
        console.log("current post user " + currentUserPost?.name);
        return(currentUserPost);
    }

    const setCurrentUserData = (users : User[]) => {
        setLoggedInUserData(users.find((user) => user.username === loggedInUser));
    }

    const fetchPost = async (): Promise<Post> => {
        const response: Response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data: Post[] = await response.json();
        const currentPost: Post | undefined = data.find(
          (post) => post.id === parseInt(postId!)
        );
        return currentPost || {} as Post;
      };

    const fetchComments = async (post : Post) => {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/comments"
        );
        const data : Comment[] = await response.json();
        const currentPostComments = data.filter(comment => comment.postId ===  post?.id);
        currentPostComments.forEach(comment => console.log(comment));
        return(currentPostComments);
    };

    useEffect(() => {
        const fetchData = async () => {
            const post : Post = await fetchPost();
            const users : User[] = await fetchUsers();
            const currentUserPost = await fetchCurrentUser(users, post);
            const comments = await fetchComments(post);

            setUsers(users);
            setCurrentUserPost(currentUserPost);
            setPost(post);
            setComments(comments);
            setCurrentUserData(users);
        }
        fetchData();
    }, []);

    // Obsluga komentarzy uzytkownika
    const handleAddComment = (name : string, body : string) => {    
        if (postId !== undefined && loggedInUserData?.email)
        {
            const newComment = {
                postId: parseInt(postId!),
                id: comments.length + 1,
                name: name,
                email: loggedInUserData?.email,
                body: body,
            }
            setComments([...comments, newComment]);
            // Tutaj moze byc asynchroniczne zapytanie do API ktore dodaje nowe komentarze
        }
    }

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (nameRef.current && bodyRef.current)
        {
            if (nameRef.current.value != "" && bodyRef.current.value != "" && commentInfoRef.current) {
                const name = nameRef.current.value;
                const body = bodyRef.current.value;
                handleAddComment(name, body);
                commentInfoRef.current.innerText = `Twój komentarz został dodany!`;
                commentInfoRef.current.style.color = "green";
                if (formRef.current) {
                    formRef.current.reset();
                }
            }
            else if (commentInfoRef.current) {
                commentInfoRef.current.innerText = `Komentarz nie może byc pusty!!`;
                commentInfoRef.current.style.color = "red";
            }
        }
      };

    const handleDeleteComment = async (id: number, commentEmail: string) => {
        if (loggedInUser === undefined || loggedInUser === null) {
            alert("Musisz się zalogować, aby usunąć komentarz!"); // Just in case
            return;
        }
        const comment = comments.find(comment => comment.id === id);
        if (comment) {
            if (loggedInUserData?.email === commentEmail) {
                await deleteComment(id);
            }
            else {
                alert("Nie masz uprawnień do usunięcia tego komentarza!"); // Just in case
                return;
            }
        }
    };

    const deleteComment = (id: number) => {
        setComments(comments.filter((photo) => photo.id !== id));
    };

    return (
        <div>
            <>
            <NavigationBar loggedInUser={loggedInUser}/>
            <div className="post-container">
            <h2>{`Post użytkownika ${currentUserPost?.name}`}</h2>
            <div className="post">
            <h3>{post?.title}</h3>
            <p>{post?.body}</p>
            </div>
            <div className="comments-container">
            <h3>Napisz komentarz</h3>
            <form onSubmit={handleSubmit} ref={formRef}>
                <input type="text" name="name" ref={nameRef} placeholder="Nagłówek komentarza"/>
                <textarea name="body" ref={bodyRef} className="text-comment" placeholder="Komentarz" />
                <button type="submit">
                    Dodaj komentarz
                </button>
            </form>
            <p ref={commentInfoRef}></p>
            <p className="comment-info" ref={commentInfoRef}></p>
            <h3>Wszystkie komentarze</h3>
            {comments.slice(0).reverse().map((comment) => (
                <div className="comment" key={comment.id}>
                <h4>{comment.email}</h4>
                <h5>{comment.name}</h5>
                <p>{comment.body}</p>
                {
                    comment.email === loggedInUserData?.email ?
                        <button className="btn-red" onClick={() => handleDeleteComment(comment.id, comment.email)}>
                            Usuń komentarz
                        </button>
                    : 
                        null
                }
                </div>
            ))}
            </div>
        </div>
            </>
        </div>
    );

}

export default CommentsPage;