// fusionai/app/api/Arcjet-test/route.js
import { NextResponse } from "next/server";
import { aj } from "@/config/ArcJet";

export async function GET(req) {
  const decision = await aj.protect(req, { requested: 5 });
  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    } else if (decision.reason.isBot()) {
      return NextResponse.json({ error: "No bots allowed" }, { status: 403 });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json({ message: "Hello world" });
}
