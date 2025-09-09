import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { client, paypal } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await request.json();
    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const orderRequest = new paypal.orders.OrdersCreateRequest();
    orderRequest.prefer("return=representation");
    orderRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: `wallet_${session.user.email}_${Date.now()}`,
          amount: {
            currency_code: "USD",
            value: amount.toString(),
          },
          description: "تعبئة رصيد المحفظة - Wallet Balance Top-up",
        },
      ],
      application_context: {
        brand_name: "Snowhost",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/wallet?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/wallet?cancelled=true`,
      },
    });

    const order = await client().execute(orderRequest);
    
    return NextResponse.json({
      success: true,
      orderID: order.result.id,
      approvalUrl: order.result.links.find((link: any) => link.rel === "approve")?.href,
    });
  } catch (error) {
    console.error("خطأ في إنشاء طلب PayPal:", error);
    return NextResponse.json(
      { error: "فشل في إنشاء طلب PayPal", details: error },
      { status: 500 }
    );
  }
}
