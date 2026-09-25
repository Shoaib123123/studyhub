import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CASHFREE_API_URL =
  "https://sandbox.cashfree.com/pg/orders";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const CASHFREE_APP_ID =
      Deno.env.get("CASHFREE_APP_ID");

    const CASHFREE_SECRET_KEY =
      Deno.env.get("CASHFREE_SECRET_KEY");

    if (
      !CASHFREE_APP_ID ||
      !CASHFREE_SECRET_KEY
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Cashfree credentials are not configured.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const authHeader =
      req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error:
            "Authorization header is missing.",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const supabaseAnonKey =
      Deno.env.get("SUPABASE_ANON_KEY");

    const supabaseServiceKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !supabaseServiceKey
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Supabase environment variables are missing.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // User client
    const userClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Admin client
    const adminClient = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    const {
      data: { user },
      error: userError,
    } =
      await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "User is not authenticated.",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json();

    const orderId = body?.order_id;

    if (!orderId) {
      return new Response(
        JSON.stringify({
          error: "order_id is required.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Find user's order
    const {
      data: order,
      error: orderError,
    } = await adminClient
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      console.error(
        "Order lookup error:",
        orderError
      );

      return new Response(
        JSON.stringify({
          error: "Order not found.",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Ask Cashfree for the real payment status
    const cashfreeResponse = await fetch(
      `${CASHFREE_API_URL}/${orderId}`,
      {
        method: "GET",
        headers: {
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret":
            CASHFREE_SECRET_KEY,
          "x-api-version": "2025-01-01",
          "Content-Type": "application/json",
        },
      }
    );

    const cashfreeData =
      await cashfreeResponse.json();

    console.log(
      "Cashfree order response:",
      cashfreeData
    );

    if (!cashfreeResponse.ok) {
      return new Response(
        JSON.stringify({
          error:
            "Unable to verify payment with Cashfree.",
          details: cashfreeData,
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const paymentStatus =
      cashfreeData?.order_status;

    console.log(
      "Payment status:",
      paymentStatus
    );

    // Payment is not PAID
    if (paymentStatus !== "PAID") {
      await adminClient
        .from("orders")
        .update({
          status:
            paymentStatus || "PENDING",
        })
        .eq("order_id", orderId);

      return new Response(
        JSON.stringify({
          success: false,
          status:
            paymentStatus || "PENDING",
          message:
            "Payment has not been completed yet.",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get purchased items
    const items = Array.isArray(order.items)
      ? order.items
      : [];

    if (!items.length) {
      return new Response(
        JSON.stringify({
          error:
            "No products were found for this order.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Convert order items into library records
    const libraryItems = items
      .map((item: any) => ({
        user_id: user.id,
        product_id: Number(
          item.product_id
        ),
      }))
      .filter(
        (item: any) =>
          Number.isInteger(
            item.product_id
          )
      );

    if (!libraryItems.length) {
      return new Response(
        JSON.stringify({
          error:
            "No valid products were found.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Add purchased products to library
    const {
      error: libraryError,
    } = await adminClient
      .from("library")
      .upsert(
        libraryItems,
        {
          onConflict:
            "user_id,product_id",
          ignoreDuplicates: true,
        }
      );

    if (libraryError) {
      console.error(
        "Library insert error:",
        libraryError
      );

      return new Response(
        JSON.stringify({
          error:
            "Payment was successful, but the product could not be added to your library.",
          details:
            libraryError.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Mark order as PAID
    await adminClient
      .from("orders")
      .update({
        status: "PAID",
      })
      .eq("order_id", orderId);

    return new Response(
      JSON.stringify({
        success: true,
        status: "PAID",
        message:
          "Payment verified and products added to your library.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Verify payment error:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while verifying payment.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});