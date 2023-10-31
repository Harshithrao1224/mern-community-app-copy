import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const userID = useGetUserID();
  const [isLoggedIn,setIsLoggedIn] = useState(!!userID);
  const [cookies] = useCookies(['access_token']);
  const navigate = useNavigate();
  const [sortedByTags, setSortedByTags] = useState(false);
  useEffect(() => {
    const token = cookies.access_token;
  setIsLoggedIn(!!userID);
  if (!isLoggedIn && token) {
    const autoLogin = async () => {
      try {
        const response = await axios.post('http://localhost:4000/auth/auto-login', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
        // Handle successful login here
        window.sessionStorage.setItem("userID", response.data.userID);
        window.sessionStorage.setItem("userName", response.data.username);
        window.location.reload(true);
      } catch (error) {
        // Handle login error here
      }
    };
    autoLogin();
  }
const fetchPosts = async () => {
try {
const response = await axios.get("http://localhost:4000/posts");
const sortedPosts = response.data.sort((a, b) => b._id.localeCompare(a._id));
setPosts(sortedPosts);
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
}, [userID, isLoggedIn,cookies,navigate]);

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
        const response = await axios.put('http://localhost:4000/posts/like', {
          postID,
          userID,
        }, {
          headers: {
            'Authorization': `Bearer ${cookies.access_token}`
          },
          withCredentials: true
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
        const response = await axios.put('http://localhost:4000/posts/unlike', {
          postID,
          userID,
        }, {
          headers: {
            'Authorization': `Bearer ${cookies.access_token}`
          },
          withCredentials: true
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