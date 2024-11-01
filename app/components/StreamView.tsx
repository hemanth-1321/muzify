"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { ThumbsUp, ThumbsDown, Play, SkipForward, Share2 } from "lucide-react";
import { Appbar } from "@/app/components/Appbar";
import axios from "axios";
import clsx from "clsx";

interface VideoItem {
  id: string;
  title: string;
  votes: number;
  upvotes: number;
  smallImg: string;
  bigImg: string;
  haveUpVoted: boolean | null;
}

const getYouTubeID = (url: string): string | null => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const REFRESH_INTERVAL_MS = 5 * 1000;

export default function StreamView({ creatorId }: { creatorId: string }) {
  const [streams, setStreams] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<{
    [key: string]: boolean | null;
  }>({});
  const [loadingVotes, setLoadingVotes] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refreshStreams() {
    try {
      const res = await axios.get(`/api/streams/?creatorId=${creatorId}`, {
        withCredentials: true,
      });
      setStreams(res.data.streams);

      if (loading) setLoading(false);
    } catch (error) {
      console.error("Error fetching streams:", error);
      setError("Failed to load streams.");
    }
  }

  useEffect(() => {
    const storedLikes = localStorage.getItem("likedVideos");
    if (storedLikes) {
      setLikedVideos(JSON.parse(storedLikes));
    }

    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (streams.length > 0) {
      setCurrentVideo(streams[0].id);
    }
  }, [streams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const videoId = getYouTubeID(videoUrl);
    if (!videoId) {
      setError("Invalid YouTube URL.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post("/api/streams", {
        creatorId: creatorId,
        url: videoUrl,
      });
      setVideoUrl("");
      refreshStreams();
    } catch (error) {
      console.error("Error adding video:", error);
      setError("Failed to add video.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (id: string, isUpvote: boolean) => {
    setLoadingVotes((prev) => ({ ...prev, [id]: true })); // Set loading for the specific video

    setStreams((prevStreams) =>
      prevStreams
        .map((video) =>
          video.id === id
            ? {
                ...video,
                votes: isUpvote
                  ? video.votes + 1
                  : Math.max(video.votes - 1, 0),
              }
            : video
        )
        .sort((a, b) => b.votes - a.votes)
    );

    try {
      await axios.post(
        `/api/streams/${isUpvote ? "upvote" : "downvote"}`,
        { streamId: id },
        { withCredentials: true }
      );
      setLikedVideos((prev) => {
        const updatedLikes = { ...prev, [id]: isUpvote };
        localStorage.setItem("likedVideos", JSON.stringify(updatedLikes));
        return updatedLikes;
      });
    } catch (error) {
      console.error("Error updating vote:", error);
      setError("Failed to update the vote.");
    } finally {
      setLoadingVotes((prev) => ({ ...prev, [id]: false })); // Clear loading state
    }
  };

  const playNext = () => {
    setStreams((prevStreams) => {
      const newStreams = prevStreams.slice(1);
      setCurrentVideo(newStreams.length > 0 ? newStreams[0].id : null);
      return newStreams;
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this page",
        text: "Have a look at this video-sharing page!",
        url: `${window.location.href}/creator/${creatorId}`,
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-100 text-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-900">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#b6d0d1] text-gray-950">
      <Appbar />
      <div className="container mx-auto p-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Currently Playing</h2>
            <div className="aspect-video mb-4">
              {currentVideo && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Currently playing video"
                ></iframe>
              )}
            </div>
            <Button onClick={playNext} className="w-full mb-4">
              <Play className="mr-2 h-4 w-4" /> Play Next Song
            </Button>
            <Button onClick={handleShare} className="w-full mb-4">
              <Share2 className="mr-2 h-4 w-4" /> Share This Page
            </Button>

            <h3 className="text-xl font-semibold mb-2">Next Up</h3>
            {streams.length > 0 ? (
              <Card className="bg-gray-800">
                <CardContent className="flex items-center justify-between p-4">
                  <img
                    src={streams[0].smallImg}
                    alt={streams[0].title}
                    className="h-14 w-15 mr-4 rounded"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{streams[0].title}</h4>
                      <p className="text-sm text-gray-400">
                        votes: {streams[0].upvotes}
                      </p>
                    </div>
                    <SkipForward className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p>No songs in the queue</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Add a Song</h2>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
              <Input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube URL here"
                color="#000"
                className="flex-grow"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
            </form>
            {error && <p className="text-red-500">{error}</p>}

            <h2 className="text-2xl font-semibold mb-4">Upcoming Songs</h2>
            <div className="space-y-4">
              {streams.slice(1).map((video) => (
                <Card key={video.id} className="bg-gray-800">
                  <CardContent className="flex items-center justify-between p-4">
                    <img
                      src={video.smallImg}
                      alt={video.title}
                      className="h-14 w-15 mr-4 rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-400">
                        Votes: {video.upvotes}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(video.id, true)}
                        className={clsx(
                          "flex items-center",
                          likedVideos[video.id] === true && "text-green-400"
                        )}
                        disabled={loadingVotes[video.id]} // Disable button while loading
                      >
                        {loadingVotes[video.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500 mr-1" />
                        ) : (
                          <ThumbsUp className="mr-1 h-4 w-4" />
                        )}
                        upvote
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(video.id, false)}
                        className={clsx(
                          "flex items-center",
                          likedVideos[video.id] === false && "text-red-400"
                        )}
                        disabled={loadingVotes[video.id]} // Disable button while loading
                      >
                        {loadingVotes[video.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500 mr-1" />
                        ) : (
                          <ThumbsDown className="mr-1 h-4 w-4" />
                        )}
                        downvote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
