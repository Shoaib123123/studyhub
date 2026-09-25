import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg/orders";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
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
    // Get Cashfree credentials from Supabase Secrets
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          error: "Cashfree credentials are not configured.",
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

    // Read request body
    const body = await req.json();

    const {
      amount,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
    } = body;

    // Validate amount
    if (!amount || Number(amount) <= 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid payment amount.",
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

    // Validate customer information
    if (!customer_name || !customer_email || !customer_phone) {
      return new Response(
        JSON.stringify({
          error:
            "Customer name, email and phone are required.",
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

    // Generate a unique StudyHub order ID
    const orderId = `studyhub_${Date.now()}`;

    // Create Cashfree order
    const cashfreeResponse = await fetch(
      CASHFREE_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2025-01-01",
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: Number(amount),
          order_currency: "INR",

          customer_details: {
            customer_id:
              customer_id || `customer_${Date.now()}`,
            customer_name: customer_name,
            customer_email: customer_email,
            customer_phone: customer_phone,
          },

          order_meta: {
            return_url:
              "https://studyhub-git-main-shoaib-s-projects-2bd5116e.vercel.app/payment-success?order_id={order_id}",
          },
        }),
      }
    );

    const data = await cashfreeResponse.json();

    // Cashfree returned an error
    if (!cashfreeResponse.ok) {
      console.error("Cashfree API error:", data);

      return new Response(
        JSON.stringify({
          error: "Cashfree order creation failed.",
          details: data,
        }),
        {
          status: cashfreeResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Successfully created Cashfree order
    return new Response(
      JSON.stringify({
        success: true,
        order_id: data.order_id,
        payment_session_id: data.payment_session_id,
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
    console.error("Create Cashfree order error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
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