import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { addComment } from "@/services/blogInteractions";
import { Avatar, Button, TextField } from "@mui/material";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { BlogComment as BlogCommentType } from "@/types/blog";

interface BlogCommentProps {
  postId: string;
  comments: BlogCommentType[];
  onCommentAdded: () => void;
}

const BlogComment: React.FC<BlogCommentProps> = ({
  postId,
  comments,
  onCommentAdded,
}) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setIsSubmitting(true);
      await addComment(
        postId,
        user.uid,
        user.displayName || "Anonymous",
        user.email || "",
        comment.trim()
      );
      setComment("");
      onCommentAdded();
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder={
            user ? "Write a comment..." : "Please sign in to comment"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!user || isSubmitting}
          className="mb-4"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!user || isSubmitting}
          className="bg-[#000054] hover:bg-[#000032]"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>{comment.userName[0]}</Avatar>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-sm text-gray-500">
                    {format(comment.createdAt.toDate(), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogComment;
