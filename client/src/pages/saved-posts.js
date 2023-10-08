import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { Link } from "react-router-dom";

export const SavedPosts= () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const userID = useGetUserID();

  console.log(savedPosts)

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/posts/savedPosts/${userID}`
        );
        setSavedPosts(response.data.savedPosts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedPosts();
  }, [userID]);
  const unsavePost = async (postId) => {
    try {
      await axios.delete(
        `http://localhost:4000/posts/savedPosts/unsave/${userID}`,
        { data: { postId } }
      );
      setSavedPosts(savedPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className="home-container">
      <h1 className="mt-4">Saved Posts</h1>
      <ul className="list-unstyled">
        {savedPosts.length === 0 ? (
          <p className="no-saved-recipes">No saved posts! Go to the<Link className="link" to="/">browse page</Link>to explore new posts!</p>
        ) : (
          savedPosts.map((post) => (
            <li key={post._id} className="card mb-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h2 className="card-title">{post.title}</h2>
                <button onClick={() => unsavePost(post._id)}>Unsave</button>
              </div>
            </div>
            <div className="card-body">
              <div className="instructions">
                <p className="card-text">{post.content}</p>
              </div>
              <h5>Tags</h5>
              {
                post.tags.map((tags) => (
                  <ul className="ingredient-list">
                    <li className="card-text">{tags}</li>
                  </ul>
                ))
              }
              <img src={post.imageUrl} alt={post.title} className="img-fluid" />
            </div>
          </li>
          ))
        )}
      </ul>
    </div>
  );
};