import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  console.log(session);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const streams = await prismaClient.stream.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          Upvotes: true,
        },
      },
      Upvotes: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  // Transform the streams array to include upvotes directly
  const formattedStreams = streams.map(({ _count, ...rest }) => ({
    ...rest,
    upvotes: _count?.Upvotes ?? 0,
    haveUpVoted: rest.Upvotes.length ? true : false,
  }));

  return NextResponse.json({ streams: formattedStreams });
}
