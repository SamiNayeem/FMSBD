'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Post {
  id: number;
  author: string;
  content: string;
  imageUrl?: string;
  responses: { message: string; volunteerName: string; timestamp: string }[];
  timestamp: string;
}

const NewsfeedPage: React.FC = () => {
  const { data: session } = useSession(); // Get session using next-auth
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/get-posts");
        setPosts(response.data); // Update the state with fetched posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    try {
      if (!session?.user?.id) {
        alert("You need to be logged in to post.");
        return;
      }

      const formData = {
        content: newPostContent,
        authorId: session.user.id, // Ensure this comes from session
        image: imageFile
          ? await convertFileToBase64(imageFile) // Convert image to base64
          : null,
      };

      console.log("Submitting post data:", formData); // Log the data before sending

      const response = await axios.post("/api/posts", formData);

      if (response.status === 201) {
        setPosts([response.data, ...posts]);
        setNewPostContent("");
        setImageFile(null); // Reset input
      } else {
        console.error("Failed to create post:", response.data);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 lg:px-64">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Flood Newsfeed
      </h2>

      {/* New Post Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Share an Update
        </h3>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          placeholder="What's happening in your area?"
        ></textarea>

        {/* Optional Image Upload */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Optional Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={handlePostSubmit}
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Post
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-800 font-semibold">{post.author}</div>
              <span className="text-sm text-gray-500">{post.timestamp}</span>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>

            {/* Display Image if available */}
            {post.imageUrl && (
              <div className="mb-4">
                <img
                  src={post.imageUrl}
                  alt="Post Image"
                  className="rounded-lg w-full h-auto"
                />
              </div>
            )}

            {/* Responses Section */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-blue-600 mb-2">
                Volunteer Responses
              </h4>
              <ul className="space-y-2">
                {post.responses.map((response, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 rounded-lg p-3 text-gray-600"
                  >
                    <span>{response.message}</span>
                    <div className="flex items-center space-x-2">
                      <a
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        {response.volunteerName}
                      </a>
                      <span className="text-xs text-gray-500">
                        {response.timestamp}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsfeedPage;
