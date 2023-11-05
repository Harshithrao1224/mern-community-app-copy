import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { AuthContext } from "../hooks/AuthProvider";
import { useGetUserID } from "../hooks/useGetUserID";
import { useContext } from "react";
import { useParams } from "react-router-dom";
export const SearchResults = () => {
  const userID = useGetUserID();
  //eslint-disable-next-line
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
const {searchTerm}=useParams();
const [savedPosts, setSavedPosts] = useState([]);
const isPostSaved = (id) => savedPosts.includes(id);
useEffect(() => {
  const fetchSearchResults = async () => {
    try {
      console.log(searchTerm);
      const response = await axios.get(`https://localhost:4000/posts/search/${searchTerm}`);
      setSearchResults(response.data);

    } catch (err) {
      console.log(err);
    }
  };

  if (searchTerm) {
    fetchSearchResults();
  }
  const fetchSavedPosts = async () => {
    try {
    const response = await axios.get(
    `https://localhost:4000/posts/savedPosts/ids/${userID}`
    );
    setSavedPosts(response.data.savedPosts);
    } catch (err) {
    console.log(err);
    }
    };
  if (isLoggedIn) {
    fetchSavedPosts();
    } else {
    setSavedPosts([]);
    }
}, [searchTerm,userID,isLoggedIn])
const likePost = async (postID) => {
  const postIndex = searchResults.findIndex(post => post._id === postID);
  if (!searchResults[postIndex].likes.includes(userID)) {
    try {
      const response = await axios.put('https://localhost:4000/posts/like', {
        postID,
        userID,
      }, {
      
        withCredentials: true
      });

      const updatedPosts = [...searchResults];
      updatedPosts[postIndex].likes.push(userID);
      updatedPosts[postIndex].likesCount = response.data.likesCount;
      setSearchResults(updatedPosts);
    } catch (err) {
      console.log(err);
    }
  }
};



const savePost = async (postID) => {
  try {
  const response = await axios.put("https://localhost:4000/posts", {
  postID,
  userID,
  });
  setSavedPosts(response.data.savedPosts);
  } catch (err) {
  console.log(err);
  }
  };
const unlikePost = async (postID) => {
  const postIndex = searchResults.findIndex(post => post._id === postID);
  if (searchResults[postIndex].likes.includes(userID)) {
    try {
      const response = await axios.put('https://localhost:4000/posts/unlike', {
        postID,
        userID,
      }, {
        withCredentials: true
      });

      const updatedPosts = [...searchResults];
      const userIndex = updatedPosts[postIndex].likes.indexOf(userID);
      updatedPosts[postIndex].likes.splice(userIndex, 1);
      updatedPosts[postIndex].likesCount = response.data.likesCount;
      setSearchResults(updatedPosts);
    } catch (err) {
      console.log(err);
    }
  }
};
  return (
    <div className="home-container">
      <h1>Search Results</h1>
      <ul className="list-unstyled">
        {searchResults.length === 0 ? (
          <p>No results matched your search criteria. Please retry or modify your search.</p>
        ) : (
          searchResults.map((post) => (
            <li key={post._id} className="cardu">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h2 className="card-title">{post.title}</h2>
                <p>Posted by: {post.userOwner.username}</p>
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
            <img src={post.imageUrl} alt={post.title} className="img-fluid" />
              <div className="instructions">
              {isLoggedIn && (
  <>
    {post.likes.includes(userID) ? (
      <button onClick={() => unlikePost(post._id)}>
        Unlike
      </button>
    ) : (
      <button onClick={() => likePost(post._id)}>
        Like
      </button>
    )}
    <span>{post.likesCount} likes</span>
  </>
)}
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