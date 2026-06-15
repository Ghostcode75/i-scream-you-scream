import { NextRequest, NextResponse } from "next/server";
import { updateRequest } from "@/lib/store";
import { IceCreamRequest, ApiResponse } from "@/lib/types";

const DRIVER_PIN = process.env.DRIVER_PIN || "1234";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<IceCreamRequest>>> {
  const { id } = await params;
  try {
    // Check PIN header
    const pin = request.headers.get("x-driver-pin");
    if (pin !== DRIVER_PIN) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updated = updateRequest(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
