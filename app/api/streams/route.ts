import { NextRequest, NextResponse } from "next/server";
import { number, z } from "zod";
import { prismaClient } from "@/app/lib/db";

//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";
const CreatStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});
export async function POST(req: NextRequest) {
  try {
    const data = CreatStreamSchema.parse(await req.json());
    const isYt = data.url.match(YT_REGEX);
    if (!isYt) {
      return NextResponse.json(
        {
          mesaage: "Wrong Url format",
        },
        {
          status: 411,
        }
      );
    }
    const extractedId = data.url.split("?v=")[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    console.log(res.title);
    console.log(res.thumbnail.thumbnails);
    const thumbnails = res.thumbnail.thumbnails;

    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );
    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: res.title ?? "Cant find video",
        smallImg:
          thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url ??
              "https://www.protectiondogs.co.uk/content/uploads/2022/10/PDW-Castle-32-crop.jpg",
        bigImg:
          thumbnails[thumbnails.length - 1].url ?? //url because it throws an error: Invalid value provided. Expected String, provided Object.
          "https://www.protectiondogs.co.uk/content/uploads/2022/10/PDW-Castle-32-crop.jpg",
      },
    });

    return NextResponse.json({
      ...stream,
      hasUpVoted: false,
      upvotes: 0,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error while adding a stream",
        details: error.errors,
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  const streams = await prismaClient.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });

  return NextResponse.json({
    streams,
  });
}
