import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json({ message: "UnAuthenticated" }, { status: 403 });
  }

  try {
    const data = UpvoteSchema.parse(await req.json());

    // Create a new upvote if it doesn't exist
    await prismaClient.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    return NextResponse.json({ message: "Upvoted!" });
  } catch (error) {
    console.error("Error while upvoting:", error);
    return NextResponse.json(
      { message: "Error while upvoting" },
      { status: 403 }
    );
  }
}
