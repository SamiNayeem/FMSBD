'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react"; // Ensure to import the useSession hook for session management

type Post = {
  id: string;
  author: {
    name: string;
    imageUrl: string | null;
  };
  timestamp: string;
  content: string;
  imageUrl: string | null;
  responses: {
    message: string;
    volunteerName: string;
    timestamp: string;
  }[];
};

const NewsfeedPage = () => {
  const { data: session } = useSession(); // Fetch session data to check for logged-in status
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); // Image file state
  const [imageBase64, setImageBase64] = useState<string | null>(null); // Base64 image string state

  // Fetch posts from the backend API when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/get-posts"); // Adjust the endpoint as needed
        // Sort posts by timestamp (latest first)
        const sortedPosts = response.data.sort((a: Post, b: Post) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setPosts(sortedPosts); // Set the sorted posts in state
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string); // Save base64 image string
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle creating a new post
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

      // Prepare the form data
      const formData = {
        content: newPostContent,
        authorId: session.user.id,
        image: imageBase64 ? imageBase64.split(',')[1] : null, // Send only the base64 data (without "data:image/jpeg;base64," prefix)
      };

      // Send the post request to the backend API
      const response = await axios.post("/api/posts", formData, {
        headers: {
          'Content-Type': 'application/json', // Ensure the data is sent as JSON
        },
      });

      if (response.status === 201) {
        // Successfully created the post, update the UI
        // Prepend the new post to the top of the list
        setPosts([response.data, ...posts]);
        setNewPostContent(""); // Clear the content input
        setImageFile(null); // Reset image file input
        setImageBase64(null); // Reset the base64 image string
      } else {
        console.error("Failed to create post:", response.data);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 mt-20">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Post Creation Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <textarea
            className="w-full h-24 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 border-black border-2 resize-none"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          
          {/* Image upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
          
          <button
            onClick={handlePostSubmit} // Corrected to call handlePostSubmit
            className="mt-4 w-full py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Post
          </button>
        </div>

        {/* Render Existing Posts */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              {/* Author Information */}
              <div className="flex items-center space-x-3">
                {post.author.imageUrl ? (
                  <img
                    src={post.author.imageUrl}
                    alt="Author"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                )}
                <div className="text-gray-800 font-semibold">{post.author.name}</div>
              </div>

              {/* Formatted Timestamp */}
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 mb-4">{post.content}</p>

            {/* Post Image */}
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
              <h4 className="text-sm font-semibold text-blue-600 mb-2">Volunteer Responses</h4>
              <ul className="space-y-2">
                {post.responses.map((response, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 rounded-lg p-3 text-gray-600"
                  >
                    <span>{response.message}</span>
                    <div className="flex items-center space-x-2">
                      <a className="text-blue-600 hover:underline text-sm font-medium">
                        {response.volunteerName}
                      </a>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(response.timestamp), { addSuffix: true })}
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
