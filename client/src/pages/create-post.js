import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";

export const CreatePost = () => {
    const userID = useGetUserID();

    const [post, setPost] = useState({
        title: "",
        tags: [],
        content: "",
        imageUrl: "",
        userOwner: userID
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddTag = () => {
        setPost((prevState) => ({
            ...prevState,
            tags: [...prevState.tags, ""],
        }));
    };

    const handleRemoveTag = (index) => {
        const updatedTags = [...post.tags];
        updatedTags.splice(index, 1);
        setPost((prevState) => ({
            ...prevState,
            tags: updatedTags,
        }));
    };

    const handleTagChange = (event, index) => {
        const { value } = event.target;
        const tags = [...post.tags];
        tags[index] = value;
        setPost((prevState) => ({
            ...prevState,
            tags,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(post);
        try {
            await axios.post("http://localhost:4000/posts", post);
            alert("Post uploaded!");
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="create-recipe">
            <h2>New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tags">Tags</label>
                    {post.tags.map((tag, index) => (
                        <div key={index} className="input-group mb-2">
                            <input
                                type="text"
                                name="tags"
                                value={tag}
                                onChange={(event) => handleTagChange(event, index)}
                                className="form-control"
                            />
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveTag(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn btn-secondary mb-3"
                >
                    Add Tag
                </button>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        className="form-control"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={post.imageUrl}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>


                <button type="submit" className="btn btn-primary">
                    Upload
                </button>
            </form>
        </div>
    );
};
