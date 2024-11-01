"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { ThumbsUp, ThumbsDown, Play, SkipForward, Share2 } from "lucide-react";
import { Appbar } from "@/app/components/Appbar";
import axios from "axios";
import clsx from "clsx";
import StreamView from "../components/StreamView";

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
const creatorId = "aac917a5-61c3-4a85-9c72-b1662d6c0f2b";
export default function Component() {
  return <StreamView creatorId={creatorId} />;
}
