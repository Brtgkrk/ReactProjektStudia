import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostPage.css";
import { Post } from "../types/Post";
import NavigationBar from "./NavigationBar";

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

type PostPageProps = {
  loggedInUser: string;
};

const PostPage: React.FC<PostPageProps> = ({ loggedInUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<Post>({ id: 0, userId: 0, title: "", body: "" });
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();

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

  const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const highestId = Math.max(...posts.map((p) => p.id));
    const newId = highestId + 1;
    
    if (newPost.title.trim() && newPost.body.trim() && newId) {
      setPosts([...posts, newPost]);
      setNewPost({ id: 0, userId: 0, title: "", body: "" });
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
        if (user.name !== userName) {
          alert("Nie masz uprawnień do usunięcia tego posta!");
          return;
        }
      }
    }
    await deletePost(id);
    //const data = await fetchPosts();
    //setPosts(data);
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };
  

  return (
    <div>
      <NavigationBar loggedInUser={loggedInUser}/>

      <h1>Posts</h1>
      <form onSubmit={handleAddPost}>
        <input
          type="text"
          name="title"
          placeholder="Enter a title"
          value={newPost.title}
          onChange={handleInputChange}
        />
        <textarea
          name="body"
          placeholder="Enter a body"
          value={newPost.body}
          onChange={handleInputChange}
        />
        <button type="submit">Add Post</button>
      </form>

      <div className="post-container">
        {posts.map((post) => {
          const user = users.find((user) => user.id === post.userId);
          const postComments = comments.filter(
            (comment) => comment.postId === post.id
          );

          return (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="post-author">{user?.name}</div>
              </div>
              <div className="post-body">
                <div className="post-title">{post.title}</div>
                <div className="post-text">{post.body}</div>
                <div className="post-comments">
                  <button
                    className="comment-button"
                    onClick={() => navigate(`/posty/${post.id}`)}
                  >
                    Skomentuj
                    <div className="comment-count">{postComments.length}</div>
                  </button>
                  <button onClick={() => handleDeletePost(post.id, loggedInUser)}>
                    Delete Post
                  </button>
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
