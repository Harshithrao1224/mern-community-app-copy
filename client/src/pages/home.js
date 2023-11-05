import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../hooks/AuthProvider'; // replace with actual path to AuthContext
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";
export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const userID = useGetUserID();
  const [sortedByTags, setSortedByTags] = useState(false);
  useEffect(() => {
  if (!isLoggedIn) {
    const autoLogin = async () => {
      try {
       const response= await axios.get('https://localhost:4000/auth/auto-login', { withCredentials: true });
        window.sessionStorage.setItem("userID", response.data.userID);
        window.sessionStorage.setItem("userName", response.data.username);
        window.location.reload(true);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("Not valid");
      }
    };
    autoLogin();
  }
const fetchPosts = async () => {
try {
const response = await axios.get("https://localhost:4000/posts");
const sortedPosts = response.data.sort((a, b) => b._id.localeCompare(a._id));
setPosts(sortedPosts);
} catch (err) {
console.log(err);
}
};

const fetchSavedPosts = async () => {
try {
const response = await axios.get(
`https://localhost:4000/posts/savedPosts/ids/${userID}`,{withCredentials:true}
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
}, [userID, isLoggedIn,setIsLoggedIn,navigate]);

const savePost = async (postID) => {
try {
const response = await axios.put("https://localhost:4000/posts", {
postID,
userID,
},{withCredentials:true});
setSavedPosts(response.data.savedPosts);
} catch (err) {
console.log(err);
}
};
const sortPostsByTags = () => {
    const sortedPosts = [...posts].sort((a, b) => {
      // Convert tags to lowercase and join them into a string for comparison
      const aTags = a.tags.map(tag => tag.toLowerCase()).join();
      const bTags = b.tags.map(tag => tag.toLowerCase()).join();
      return aTags.localeCompare(bTags);
    });
    setPosts(sortedPosts);
    setSortedByTags(true);
  };
  
  const sortPostsById = () => {
    const sortedPosts = [...posts].sort((a, b) => b._id.localeCompare(a._id));
    setPosts(sortedPosts);
    setSortedByTags(false);
  };
const isPostSaved = (id) => savedPosts.includes(id);
const likePost = async (postID) => {
    const postIndex = posts.findIndex(post => post._id === postID);
    if (!posts[postIndex].likes.includes(userID)) {
      try {
        const response = await axios.put('https://localhost:4000/posts/like', {
          postID,
          userID,
        }, {          withCredentials: true
        });
  
        const updatedPosts = [...posts];
        updatedPosts[postIndex].likes.push(userID);
        updatedPosts[postIndex].likesCount = response.data.likesCount;
        setPosts(updatedPosts);
      } catch (err) {
        console.log(err);
      }
    }
  };
  
  const unlikePost = async (postID) => {
    const postIndex = posts.findIndex(post => post._id === postID);
    if (posts[postIndex].likes.includes(userID)) {
      try {
        const response = await axios.put('https://localhost:4000/posts/unlike', {
          postID,
          userID,
        }, {          withCredentials: true
        });
  
        const updatedPosts = [...posts];
        const userIndex = updatedPosts[postIndex].likes.indexOf(userID);
        updatedPosts[postIndex].likes.splice(userIndex, 1);
        updatedPosts[postIndex].likesCount = response.data.likesCount;
        setPosts(updatedPosts);
      } catch (err) {
        console.log(err);
      }
    }
  };
  

return (
<div className="home-container">
<h1 className="mt-4">Posts</h1>
<button onClick={sortedByTags ? sortPostsById : sortPostsByTags}>
      {sortedByTags ? 'Show Latest Posts' : 'Sort Posts By Tags'}
    </button>
<ul className="list-unstyled">
{posts.map((post) => (
    
<li key={post._id} className="cardu">
<div className="card-body d-flex justify-content-between
align-items-center">
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
<img
src={post.imageUrl}
alt={post.title}
className="img-fluid"

/>

<div className="instructions">
{isLoggedIn && (
  <>
    {post.likes.includes(userID) ? (
      <button onClick={() => unlikePost(post._id)}className="unlike">
        Unlike
      </button>
    ) : (
      <button onClick={() => likePost(post._id)}className="like">
        Like
      </button>
    )}
    <span className="like-count">{post.likesCount} likes</span>
  </>
)}
<p className="card-text">{post.content}</p>
</div>
<div className="tags">
{post.tags.map((tag, index) => (
<ul key={index} className="ingredient-list">
<li className="card-text">#{tag}</li>
</ul>
))}</div>
</div>
</li>
))}
</ul>
</div>
);
}