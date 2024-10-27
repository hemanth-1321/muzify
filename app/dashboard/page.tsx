"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Play, SkipForward } from "lucide-react";
import { Appbar } from "@/components/Appbar";

// Helper function to extract video ID from YouTube URL
const getYouTubeID = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function Component() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoQueue, setVideoQueue] = useState([
    {
      id: "dQw4w9WgXcQ",
      title: "Rick Astley - Never Gonna Give You Up",
      votes: 5,
    },
    { id: "L_jWHffIx5E", title: "Smash Mouth - All Star", votes: 3 },
    { id: "fJ9rUzIMcZQ", title: "Queen - Bohemian Rhapsody", votes: 4 },
  ]);
  const [currentVideo, setCurrentVideo] = useState("dQw4w9WgXcQ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = getYouTubeID(videoUrl);
    if (videoId) {
      // In a real app, you'd fetch the video title from the YouTube API
      setVideoQueue([
        ...videoQueue,
        { id: videoId, title: "New Video", votes: 0 },
      ]);
      setVideoUrl("");
    }
  };

  const handleVote = (index: number, increment: number) => {
    const newQueue = [...videoQueue];
    newQueue[index].votes += increment;
    newQueue.sort((a, b) => b.votes - a.votes);
    setVideoQueue(newQueue);
  };

  const playNext = () => {
    if (videoQueue.length > 0) {
      setCurrentVideo(videoQueue[0].id);
      setVideoQueue(videoQueue.slice(1));
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
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Currently playing video"
              ></iframe>
            </div>
            <Button onClick={playNext} className="w-full mb-4">
              <Play className="mr-2 h-4 w-4" /> Play Next Song
            </Button>

            <h3 className="text-xl font-semibold mb-2">Next Up</h3>
            {videoQueue.length > 0 ? (
              <Card className="bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{videoQueue[0].title}</h4>
                      <p className="text-sm text-gray-400">
                        Votes: {videoQueue[0].votes}
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

            {videoUrl && getYouTubeID(videoUrl) && (
              <div className="aspect-video mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYouTubeID(
                    videoUrl
                  )}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video preview"
                ></iframe>
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-4">Upcoming Songs</h2>
            <div className="space-y-4">
              {videoQueue.slice(1).map((video, index) => (
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
                        size="sm"
                        onClick={() => handleVote(index + 1, 1)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleVote(index + 1, -1)}
                      >
                        <ThumbsDown className="h-4 w-4" />
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
