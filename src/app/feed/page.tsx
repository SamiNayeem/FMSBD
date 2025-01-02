'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

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
    id: string;
    message: string;
    volunteerName: string;
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
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); // Track post for confirmation
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation modal state

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

  const handleMarkAsRescued = async (postId: string) => {
    try {
      const response = await axios.patch(`/api/posts/${postId}/rescue`);
      if (response.status === 200) {
        setPosts(posts.filter((post) => post.id !== postId));
        setShowConfirmation(false);
        setSelectedPostId(null);
      }
    } catch (error) {
      console.error("Error marking post as rescued:", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentContent[postId]?.trim()) {
      alert("Comment content cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`/api/posts/${postId}/comment`, {
        message: commentContent[postId],
        userId: session?.user?.id,
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
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 mt-20">
      <div className="max-w-3xl mx-auto space-y-8">
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

        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
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
              <div className="relative">
                {/* Three-dot icon */}
                {session?.user?.role === "Admin" && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedPostId(selectedPostId === post.id ? null : post.id)
                      }
                      className="text-gray-600 hover:text-gray-800"
                    >
                      &#x22EE; {/* Three-dot icon */}
                    </button>
                    {selectedPostId === post.id && (
                      <div className="absolute right-0 mt-2 shadow-lg rounded-lg py-2 z-10 w-40 bg-blue-100">
                        <button
                          onClick={() => setShowConfirmation(true)}
                          className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                        >
                          Mark as Rescued
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
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
                      <a className="text-blue-600 hover:underline text-sm font-medium">
                        {response.volunteerName}
                      </a>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(response.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
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

        {/* Confirmation Modal */}
        {showConfirmation && selectedPostId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Are you sure you want to mark this post as rescued?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleMarkAsRescued(selectedPostId)}
                  className="py-2 px-4 bg-red-600 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsfeedPage;
