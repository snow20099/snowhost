import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { client, paypal } from "@/lib/paypal";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderID } = await request.json();
    if (!orderID) {
      return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
    }

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
    captureRequest.requestBody({});

    const capture = await client().execute(captureRequest);

    if (capture.result.status === "COMPLETED") {
      const amount = parseFloat(
        capture.result.purchase_units[0].payments.captures[0].amount.value
      );

      // تحديث رصيد المستخدم في قاعدة البيانات
      await connectToDatabase();
      await User.findOneAndUpdate(
        { email: session.user.email },
        {
          $inc: { balance: amount },
          $push: {
            transactions: {
              id: `TXN-${Date.now()}`,
              transactionId: capture.result.id,
              amount: amount,
              type: "deposit",
              method: "PayPal",
              status: "completed",
              reason: "PayPal Payment - دفع عبر PayPal",
              date: new Date(),
            },
          },
        }
      );

      return NextResponse.json({
        success: true,
        captureId: capture.result.id,
        amount: amount,
        status: "completed",
        message: "تم الدفع بنجاح وتحديث الرصيد",
      });
    }

    return NextResponse.json(
      { error: "الدفعة لم تكتمل" },
      { status: 400 }
    );
  } catch (error) {
    console.error("خطأ في التقاط دفعة PayPal:", error);
    return NextResponse.json(
      { error: "فشل في التقاط دفعة PayPal" },
      { status: 500 }
    );
  }
}
