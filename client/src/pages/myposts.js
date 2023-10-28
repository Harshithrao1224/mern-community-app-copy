import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/posts/myPosts/${userID}`
        );
        setMyPosts(response.data.myPosts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMyPosts();
  }, [userID]);

  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `http://localhost:4000/posts/myPosts/delete/${userID}`,
        { data: { postId } }
      );
      setMyPosts(myPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.log(err);
    }
  };
  const navigate = useNavigate();
  const handleEditPost = (postId) => {
    navigate(`/editPost/${postId}`);
  };
  return (
    <div className="home-container">
      <h1 className="mt-4">My Posts</h1>
      <ul className="list-unstyled">
        {myPosts.length === 0 ? (
          <p className="no-posts">No posts yet! Go to the<Link className="link" to="/">browse page</Link>to explore new posts!</p>
        ) : (
          myPosts.map((post) => (
            <li key={post._id} className="cardu">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="card-title">{post.title}</h2>
                  <button onClick={() => deletePost(post._id)}>Delete</button>
                  <button onClick={() => handleEditPost(post._id)}>Edit</button>
                </div>
              </div>
              <div className="card-body">
                <img src={post.imageUrl} alt={post.title} className="img-fluid" />
                <div className="instructions">
                  <p className="card-text">{post.content}</p>
                </div>
                <div className="tags">
                  {post.tags.map((tag) => (
                    <ul className="ingredient-list">
                      <li className="card-text">#{tag}</li>
                    </ul>
                  ))}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
