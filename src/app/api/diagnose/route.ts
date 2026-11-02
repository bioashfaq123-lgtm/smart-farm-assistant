import { NextResponse } from "next/server";
import { runDiagnosisPipeline } from "@/lib/diagnosis/pipeline";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "anonymous";

    const body = await request.json();
    const result = await runDiagnosisPipeline(body, { clientIp });
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    console.error("Diagnosis route exception:", err);
    return NextResponse.json(
      {
        success: false,
        status: "provider_error",
        error: "Internal server error processing diagnosis request.",
      },
      { status: 500 }
    );
  }
}
