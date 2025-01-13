'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

type Post = {
  id: string;
  author: {
    name: string;
    role: string;
    imageUrl: string | null;
  };
  timestamp: string;
  content: string;
  imageUrl: string | null;
  responses: {
    id: string;
    message: string;
    volunteerName: string;
    role: string;
    timestamp: string;
  }[];
};

const NewsfeedPage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [menuOpen, setMenuOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/get-posts");
        const sortedPosts = response.data.sort(
          (a: Post, b: Post) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        authorId: session.user.id,
        image: imageBase64 ? imageBase64.split(",")[1] : null,
      };

      const response = await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setPosts([response.data, ...posts]);
        setNewPostContent("");
        setImageFile(null);
        setImageBase64(null);
      } else {
        console.error("Failed to create post:", response.data);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentContent[postId]?.trim()) {
      alert("Comment content cannot be empty");
      return;
    }

    try {
      if (!session?.user?.id) {
        alert("You need to be logged in to comment.");
        return;
      }

      const response = await axios.post(`/api/posts/${postId}/comment`, {
        userId: session.user.id,
        message: commentContent[postId],
      });

      if (response.status === 201) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  responses: [...post.responses, response.data],
                }
              : post
          )
        );
        setCommentContent({ ...commentContent, [postId]: "" });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert((error as any)?.response?.data?.error || "An error occurred while adding the comment.");
    }
  };

  // Handle the Mark as Rescued action
  const handleMarkAsRescued = async (postId: string) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/rescue`);

      if (response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, IsActive: 0 } : post
          )
        );
        alert("Post marked as rescued.");
      }
    } catch (error) {
      console.error("Error rescuing post:", error);
      alert("An error occurred while rescuing the post.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 mt-20">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* New Post Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <textarea
            className="w-full h-24 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 border-black border-2 resize-none"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />

          <button
            onClick={handlePostSubmit}
            className="mt-4 w-full py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Post
          </button>
        </div>

        {/* Display Posts */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
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

              <div
                className={`text-sm font-medium rounded-full px-3 py-1 ml-2 ${
                  post.author.role === "Admin"
                    ? "bg-red-500 text-white"
                    : post.author.role === "Volunteer"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {post.author.role}
              </div>

              {/* Admin Three-Dot Menu */}
              {post.author.role === "Admin" && (
                <div className="relative ml-auto">
                  <button
                    onClick={() =>
                      setMenuOpen((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="text-gray-600 hover:text-gray-800"
                  >
                    &#x22EE;
                  </button>
                  {menuOpen[post.id] && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <button
                        onClick={() => handleMarkAsRescued(post.id)}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Mark as Rescued
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-700 mb-4">{post.content}</p>

            {post.imageUrl && (
              <div className="mb-4">
                <img
                  src={post.imageUrl}
                  alt="Post Image"
                  className="rounded-lg w-full h-auto"
                />
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-blue-600 mb-2">Volunteer Responses</h4>
              <ul className="space-y-2">
                {post.responses.map((response) => {
                  const timestamp = new Date(response.timestamp);
                  const formattedTimestamp = isNaN(timestamp.getTime())
                    ? null
                    : timestamp;

                  return (
                    <li key={response.id} className="flex justify-between items-center bg-gray-100 rounded-lg p-3 text-gray-600">
                      <span>{response.message}</span>
                      <div className="flex items-center space-x-2">
                        <a className="text-blue-600 hover:underline text-sm font-medium">
                          {response.volunteerName}
                        </a>
                        <span className="text-xs text-gray-500">
                          {formattedTimestamp
                            ? formatDistanceToNow(formattedTimestamp, { addSuffix: true })
                            : "Invalid date"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Add a new comment */}
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded-lg"
                  placeholder="Add a comment..."
                  value={commentContent[post.id] || ""}
                  onChange={(e) =>
                    setCommentContent({
                      ...commentContent,
                      [post.id]: e.target.value,
                    })
                  }
                ></textarea>
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-lg"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsfeedPage;
