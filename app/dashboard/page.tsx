"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Play, SkipForward, Share2 } from "lucide-react";
import { Appbar } from "@/components/Appbar";
import axios from "axios";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { YT_REGEX } from "../lib/utils";
interface VideoItem {
  id: string;
  title: string;
  votes: number;
}

const getYouTubeID = (url: string): string | null => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function Component() {
  const [streams, setStreams] = useState<VideoItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  async function refreshStreams() {
    try {
      const res = await axios.get("/api/streams/myStreams", {
        withCredentials: true,
      });
      setStreams(res.data.streams);
    } catch (error) {
      console.error("Error fetching streams:", error);
      setError("Failed to load streams.");
    }
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (streams.length > 0) {
      setCurrentVideo(streams[0].id); // Set the first video in the queue as current
    }
  }, [streams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const videoId = getYouTubeID(videoUrl);
    if (videoId) {
      try {
        await axios.post("/api/streams", {
          creatorId: "e1412b11-b8d4-4251-add5-36ad223dcb9c",
          url: videoUrl,
        });
        setVideoUrl("");
        refreshStreams();
      } catch (error) {
        console.error("Error adding video:", error);
        setError("Failed to add video.");
      }
    }
  };

  const handleVote = async (id: string, isUpvote: boolean) => {
    // Update the local state for the vote count
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

    // Make an API request to update the vote on the server
    try {
      await axios.post(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
        streamId: id,
      });
    } catch (error) {
      console.error("Error updating vote:", error);
      setError("Failed to update the vote.");
    }
  };

  const playNext = () => {
    if (streams.length > 0) {
      setCurrentVideo(streams[0].id);
      setStreams((prevStreams) => prevStreams.slice(1));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this page",
        text: "Have a look at this video-sharing page!",
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
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
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{streams[0].title}</h4>
                      <p className="text-sm text-gray-400">
                        Votes: {streams[0].votes}
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
                className="flex-grow"
              />
              <Button type="submit">Add</Button>
            </form>

            {videoUrl && videoUrl.match(YT_REGEX) && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <LiteYouTubeEmbed id={videoUrl.split("?v=")[1]} title="" />
                </CardContent>
              </Card>
            )}

            <h2 className="text-2xl font-semibold mb-4">Upcoming Songs</h2>
            <div className="space-y-4">
              {streams.slice(1).map((video) => (
                <Card key={video.id} className="bg-gray-800">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-grow">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-400">
                        Votes: {video.votes}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(video.id, !video.votes)}
                      >
                        {video.votes > 0 ? (
                          <ThumbsDown className="h-4 w-4" />
                        ) : (
                          <ThumbsUp className="h-4 w-4" />
                        )}
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
