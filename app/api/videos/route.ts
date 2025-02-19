import { authOptions } from "@/lib/auth";
import { connectionDb } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        await connectionDb();
        const videos = await Video.find({}).sort().lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(videos)

    } catch (error) {
        console.log("Error on feteching data: ", error)
        return NextResponse.json(
            { error: "Error in featching videos" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body: IVideo = await req.json()

        if (
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData);

        return NextResponse.json(newVideo);
    } catch (error) {
        console.log("Error in createing video", error);
        return NextResponse.json(
            { error: "Error in creating videos" },
            { status: 500 }
        )
    }
}