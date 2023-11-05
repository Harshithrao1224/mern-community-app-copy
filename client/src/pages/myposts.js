import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const userID = useGetUserID();
  // eslint-disable-next-line
  const [sortedByTags, setSortedByTags] = useState(false);
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(
          `https://localhost:4000/posts/myPosts/${userID}`,{withCredentials:true}
        );
        const sortedPosts = response.data.myPosts.sort((a, b) => b._id.localeCompare(a._id));
        setMyPosts(sortedPosts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMyPosts();
  }, [userID]);

  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `https://localhost:4000/posts/myPosts/delete/${userID}`,
        { data: { postId }, withCredentials: true }
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
  const sortPostsByTags = () => {
    const sortedPosts = [...myPosts].sort((a, b) => {
      // Convert tags to lowercase and join them into a string for comparison
      const aTags = a.tags.map(tag => tag.toLowerCase()).join();
      const bTags = b.tags.map(tag => tag.toLowerCase()).join();
      return aTags.localeCompare(bTags);
    });
    setMyPosts(sortedPosts);
    setSortedByTags(true);
  };

  const sortPostsById = () => {
    const sortedPosts = [...myPosts].sort((a, b) => b._id.localeCompare(a._id));
    setMyPosts(sortedPosts);
    setSortedByTags(false);
  };
  return (
    <div className="home-container">
      <h1 className="mt-4">My Posts</h1>
      <button onClick={sortedByTags ? sortPostsById : sortPostsByTags}>
            {sortedByTags ? 'Show Latest Posts' : 'Sort Posts By Tags'}
          </button>
      <ul className="list-unstyled">
        {myPosts.length === 0 ? (
          <p className="no-posts">No posts yet! Go to the<Link className="link" to="/create-post">Create Post</Link>to create your first post!</p>
        ) : (
          
          myPosts.map((post) => (
            <li key={post._id} className="cardu">
              
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="card-title">{post.title}</h2>
                  <button onClick={() => deletePost(post._id)} className="card-title-del">Delete</button>
                  <button onClick={() => handleEditPost(post._id)}className="card-title-edit">Edit</button>
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
