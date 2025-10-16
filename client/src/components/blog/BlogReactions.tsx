import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  addReaction,
  removeReaction,
  getUserReaction,
} from "@/services/blogInteractions";
import { IconButton, Tooltip } from "@mui/material";
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

interface BlogReactionsProps {
  postId: string;
  reactionCount: number;
  onReactionChange: () => void;
}

const BlogReactions: React.FC<BlogReactionsProps> = ({
  postId,
  reactionCount,
  onReactionChange,
}) => {
  const { user } = useAuth();
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserReaction();
    }
  }, [user, postId]);

  const loadUserReaction = async () => {
    if (!user) return;
    try {
      const reaction = await getUserReaction(postId, user.uid);
      setUserReaction(reaction?.type || null);
    } catch (error) {
      console.error("Error loading user reaction:", error);
    }
  };

  const handleReaction = async (type: "like" | "love" | "celebrate") => {
    if (!user) {
      toast.error("Please sign in to react");
      return;
    }

    try {
      setIsLoading(true);
      if (userReaction === type) {
        await removeReaction(postId, user.uid);
        setUserReaction(null);
      } else {
        await addReaction(
          postId,
          user.uid,
          user.displayName || "Anonymous",
          type
        );
        setUserReaction(type);
      }
      onReactionChange();
    } catch (error) {
      console.error("Error handling reaction:", error);
      toast.error("Failed to update reaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Tooltip title={userReaction === "like" ? "Unlike" : "Like"}>
        <IconButton
          onClick={() => handleReaction("like")}
          disabled={isLoading}
          color={userReaction === "like" ? "primary" : "default"}
        >
          {userReaction === "like" ? <FaThumbsUp /> : <FaRegThumbsUp />}
        </IconButton>
      </Tooltip>

      <Tooltip title={userReaction === "love" ? "Remove Love" : "Love"}>
        <IconButton
          onClick={() => handleReaction("love")}
          disabled={isLoading}
          color={userReaction === "love" ? "error" : "default"}
        >
          {userReaction === "love" ? <FaHeart /> : <FaRegHeart />}
        </IconButton>
      </Tooltip>

      <Tooltip
        title={userReaction === "celebrate" ? "Remove Celebrate" : "Celebrate"}
      >
        <IconButton
          onClick={() => handleReaction("celebrate")}
          disabled={isLoading}
          color={userReaction === "celebrate" ? "warning" : "default"}
        >
          {userReaction === "celebrate" ? <FaStar /> : <FaRegStar />}
        </IconButton>
      </Tooltip>

      <span className="text-gray-600">{reactionCount}</span>
    </div>
  );
};

export default BlogReactions;
