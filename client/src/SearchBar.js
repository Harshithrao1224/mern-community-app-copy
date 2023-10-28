import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';

export const SearchBar = () => {
const [searchTerm, setSearchTerm] = useState('');
const navigate = useNavigate();

const handleSearchChange = (event) => {
setSearchTerm(event.target.value);
}

const handleSearchSubmit = (event) => {
event.preventDefault();
navigate(`/searchresults/${searchTerm}`);
}

return (
<form onSubmit={handleSearchSubmit}>
<input
type="text"
placeholder="Search…"
value={searchTerm}
onChange={handleSearchChange}
/>
<button type="submit">Search</button>
</form>
);
}
