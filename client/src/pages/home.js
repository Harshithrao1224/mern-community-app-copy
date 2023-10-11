import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const userID = useGetUserID();
  const isLoggedIn = !!userID;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/posts");
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/posts/savedPosts/ids/${userID}`
        );
        setSavedPosts(response.data.savedPosts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
    if (isLoggedIn) {
      fetchSavedPosts();
    } else {
      setSavedPosts([]);
    }
  }, [userID, isLoggedIn]);

  const savePost = async (postID) => {
    try {
      const response = await axios.put("http://localhost:4000/posts", {
        postID,
        userID,
      });
      setSavedPosts(response.data.savedPosts);
    } catch (err) {
      console.log(err);
    }
  };

  const isPostSaved = (id) => savedPosts.includes(id);

  return (
    <div className="home-container">
      <h1 className="mt-4">Posts</h1>
      <ul className="list-unstyled">
        {posts.map((post) => (
          <li key={post._id} className="card mb-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h2 className="card-title">{post.title}</h2>
              </div>
              {isLoggedIn && (
                <button
                  onClick={() => savePost(post._id)}
                  className={`btn ${
                    isPostSaved(post._id) ? "btn-success" : "btn-primary"
                  }`}
                  disabled={isPostSaved(post._id)}
                >
                  {isPostSaved(post._id) ? "Saved" : "Save"}
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="instructions">
                <p className="card-text">{post.content}</p>
              </div>
              <h5>Tags</h5>
              {post.tags.map((tag, index) => (
                <ul key={index} className="ingredient-list">
                  <li className="card-text">{tag}</li>
                </ul>
              ))}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="img-fluid"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
