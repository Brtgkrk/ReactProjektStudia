import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
// Types
import { Post } from "../types/Post";
import { User } from "../types/User";
import { Comment } from "../types/Comment";
// Styles
import "../styles/PostPage.css";

type PostPageProps = {
  loggedInUser: string;
};

const PostPage: React.FC<PostPageProps> = ({ loggedInUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<Post>({ id: 0, userId: 0, title: "", body: "" });
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserData, setCurrentUserData] = useState<User>();
  const navigate = useNavigate();
  const postInfoRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const data = await response.json();
      setPosts(data);
    };

  const fetchUsers = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );
    const data = await response.json();
    setUsers(data);
  };

  const fetchComments = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    );
    const data = await response.json();
    setComments(data);
  };

  fetchPosts();
  fetchUsers();
  fetchComments();
  }, []);

  useEffect(() => {
    const setCurrentUser = () => {
      setCurrentUserData(users.find(user => user.username === loggedInUser));
    }
    setCurrentUser();
  },[users])

  const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const highestId = Math.max(...posts.map((p) => p.id));
    const newId = highestId + 1;
    
    if (newPost.title.trim() && newPost.body.trim() && newId) {
      if (currentUserData)
        setNewPost({ id: 0, userId: currentUserData.id, title: "", body: "" });
      console.log(newPost);
      console.log(currentUserData);
      if (currentUserData)
      setPosts([...posts, { id: newPost.id, userId: currentUserData.id, title: newPost.title, body: newPost.body }]);
      setNewPost({ id: 0, userId: 0, title: "", body: "" });
      if (postInfoRef.current)
      {
        postInfoRef.current.innerText = `Twój post został pomyślnie dodany na końcu listy`;
        postInfoRef.current.style.color = "green";
      }
    }
    else if (postInfoRef.current) {
      postInfoRef.current.innerText = `Wypełnij tytuł i zawartość posta!`;
      postInfoRef.current.style.color = "red";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeletePost = async (id: number, userName: string) => {
    if (loggedInUser === undefined || loggedInUser === null) {
      alert("Musisz się zalogować, aby usunąć post!");
      return;
    }
    const post = posts.find(post => post.id === id);
    if (post) {
      const user = users.find(user => user.id === post.userId);
      if (user) {
        if (user.name !== currentUserData?.name) {
          alert("Nie masz uprawnień do usunięcia tego posta!");
          return;
        }
      }
    }
    await deletePost(id);
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div>
      <NavigationBar loggedInUser={loggedInUser}/>
      <h3 className="text-center">Dodaj własny post</h3>
      <form onSubmit={handleAddPost}>
        <input
          type="text"
          name="title"
          placeholder="Tytuł"
          value={newPost.title}
          onChange={handleInputChange}
          className="input-photo"
        />
        <textarea
          name="body"
          placeholder="Zawartość"
          value={newPost.body}
          onChange={handleInputChange}
          className = "post-body"
        />
        <button type="submit">Dodaj post</button>
      </form>
      <p ref={postInfoRef} className="text-center"></p>
      <h2 className="text-center">Wszystkie posty użytkowników</h2>
      <div className="post-container">
        {posts.map((post) => {
          const user = users.find((user) => user.id === post.userId);
          const postComments = comments.filter(
            (comment) => comment.postId === post.id
          );

          return (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="post-author text-underline" onClick={() => navigate(`/uzytkownicy/${user?.username}`)}>{user?.name}</div>
              </div>
              <div className="post-body">
                <div className="post-title">{post.title}</div>
                <div className="post-text">{post.body}</div>
                <div className="post-comments">
                  <button
                    className="comment-button"
                    onClick={() => navigate(`/posty/${post.id}`)}
                  >
                    Skomentuj ({postComments.length})
                  </button>
                  { (post.userId === currentUserData?.id) ?
                    <button onClick={() => handleDeletePost(post.id, loggedInUser)} className="btn-red">
                    Usuń post
                    </button>
                    : null
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostPage;