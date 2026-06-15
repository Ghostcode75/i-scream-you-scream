import { NextRequest, NextResponse } from "next/server";
import { getTruck, updateTruck } from "@/lib/store";
import { TruckStatus, ApiResponse } from "@/lib/types";

const DRIVER_PIN = process.env.DRIVER_PIN || "1234";

export async function GET(): Promise<NextResponse<ApiResponse<TruckStatus>>> {
  try {
    const truck = getTruck();
    return NextResponse.json({ success: true, data: truck });
  } catch (error) {
    console.error("Error fetching truck status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse<TruckStatus>>> {
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
    const updated = updateTruck(body);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating truck status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
