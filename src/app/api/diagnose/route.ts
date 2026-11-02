import { NextResponse } from "next/server";
import { executeDiagnosis, type DiagnosisRequest } from "@/lib/diagnosisSafety";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body: DiagnosisRequest = await request.json();
    const result = await executeDiagnosis(body);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    console.error("Diagnosis route exception:", err);
    return NextResponse.json(
      {
        error: "Internal server error processing diagnosis request.",
      },
      { status: 500 }
    );
  }
}
