import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { Link } from "react-router-dom";

export const SavedPosts= () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const userID = useGetUserID();
  const [sortedByTags, setSortedByTags] = useState(false);
  console.log(savedPosts)

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/posts/savedPosts/${userID}`
        );
        const sortedPosts = response.data.savedPosts.sort((a, b) => b._id.localeCompare(a._id));
        setSavedPosts(sortedPosts);
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
  const sortPostsByTags = () => {
    const sortedPosts = [...savedPosts].sort((a, b) => {
      // Convert tags to lowercase and join them into a string for comparison
      const aTags = a.tags.map(tag => tag.toLowerCase()).join();
      const bTags = b.tags.map(tag => tag.toLowerCase()).join();
      return aTags.localeCompare(bTags);
    });
    setSavedPosts(sortedPosts);
    setSortedByTags(true);
  };

  const sortPostsById = () => {
    const sortedPosts = [...savedPosts].sort((a, b) => b._id.localeCompare(a._id));
    setSavedPosts(sortedPosts);
    setSortedByTags(false);
  };
  return (
    <div className="home-container">
      <h1 className="mt-4">Saved Posts</h1>
      <button onClick={sortedByTags ? sortPostsById : sortPostsByTags}>
        {sortedByTags ? 'Show Latest Posts' : 'Sort Posts By Tags'}
      </button>
      <ul className="list-unstyled">
        {savedPosts.length === 0 ? (
          <p className="no-saved-recipes">No saved posts! Go to the<Link className="link" to="/">browse page</Link>to explore new posts!</p>
        ) : (
          savedPosts.map((post) => (
            
            <li key={post._id} className="cardu">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h2 className="card-title">{post.title}</h2>
                <p>Posted by: {post.userOwner.username}</p>
                <button onClick={() => unsavePost(post._id)}>Unsave</button>
              </div>
              
            </div>
            <div className="card-body">
            <img src={post.imageUrl} alt={post.title} className="img-fluid" />
              <div className="instructions">
                <p className="card-text">{post.content}</p>
              </div>
              <div className="tags">
              {
                post.tags.map((tags) => (
                  <ul className="ingredient-list">
                    <li className="card-text">#{tags}</li>
                  </ul>
                ))
              }</div>
             
            </div>
          </li>
          ))
        )}
      </ul>
    </div>
  );
};