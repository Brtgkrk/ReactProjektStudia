import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostPage.css";
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

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type HomePageProps = {
  loggedInUser: string | null;
};

const HomePage: React.FC<HomePageProps> = ({ loggedInUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
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

  return (
    <div>
      <NavigationBar loggedInUser={loggedInUser}/>
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
                    onClick={() => navigate(`/comments/${post.id}`)}
                  >
                    Skomentuj
                    <div className="comment-count">{postComments.length}</div>
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

export default HomePage;
