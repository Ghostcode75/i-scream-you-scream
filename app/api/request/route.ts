import { NextRequest, NextResponse } from "next/server";
import { addRequest, getRequestsByStatus } from "@/lib/store";
import { IceCreamRequest, ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<IceCreamRequest>>> {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.area || !body.street) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newRequest: IceCreamRequest = {
      id: body.id || Math.random().toString(36).slice(2, 10),
      area: body.area,
      street: body.street,
      name: body.name || "Neighbor",
      treats: body.treats || {},
      totalItems: body.totalItems || 0,
      totalPrice: body.totalPrice || 0,
      neighbors: body.neighbors || 1,
      status: "pending",
      ts: Date.now(),
    };

    const saved = addRequest(newRequest);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<IceCreamRequest[]>>> {
  try {
    const status = request.nextUrl.searchParams.get("status");
    const requests = getRequestsByStatus(status || undefined);
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
