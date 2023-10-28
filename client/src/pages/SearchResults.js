import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useParams } from "react-router-dom";
export const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
const {searchTerm}=useParams();
console.log(searchTerm);
useEffect(() => {
  const fetchSearchResults = async () => {
    try {
      console.log(searchTerm);
      const response = await axios.get(`http://localhost:4000/posts/search/${searchTerm}`);
      setSearchResults(response.data);

    } catch (err) {
      console.log(err);
    }
  };

  if (searchTerm) {
    fetchSearchResults();
  }
}, [searchTerm])

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
              </div>
              
            </div>
            <div className="card-body">
            <img src={post.imageUrl} alt={post.title} className="img-fluid" />
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
             
            </div>
          </li>
          ))
        )}
      </ul>
    </div>
  );
};