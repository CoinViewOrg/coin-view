import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

type Environment = "production" | "development" | "other";
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const currentEnv = process.env.NODE_ENV as Environment;

  if (
    currentEnv === "production" &&
    req.nextUrl.hostname.includes("coin-view.krzotki.com")
  ) {
    return NextResponse.redirect(
      `https://coin-view.herokuapp.com${req.nextUrl.pathname}`,
      301
    );
  }
  return NextResponse.next();
}
