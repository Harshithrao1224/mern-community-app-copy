import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/searchresults/${searchTerm}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" disabled={!searchTerm.trim()}>Search</button>
    </form>
  );
};
