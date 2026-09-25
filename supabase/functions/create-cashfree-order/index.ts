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
    // ----------------------------------------
    // Cashfree credentials
    // ----------------------------------------

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

    // ----------------------------------------
    // Authorization
    // ----------------------------------------

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

    // ----------------------------------------
    // Supabase configuration
    // ----------------------------------------

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

    // ----------------------------------------
    // User client
    // Used only to verify logged-in user
    // ----------------------------------------

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

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error:
            "User is not authenticated.",
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

    // ----------------------------------------
    // Admin client
    // Used for server-side database operations
    // ----------------------------------------

    const adminClient = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    // ----------------------------------------
    // Request body
    // ----------------------------------------

    const body = await req.json();

    const {
      amount,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      items,
    } = body;

    // ----------------------------------------
    // Validate amount
    // ----------------------------------------

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid payment amount.",
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

    // ----------------------------------------
    // Validate customer details
    // ----------------------------------------

    if (
      !customer_name ||
      !customer_email ||
      !customer_phone
    ) {
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

    // ----------------------------------------
    // Validate products
    // ----------------------------------------

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return new Response(
        JSON.stringify({
          error:
            "No products were provided.",
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

    // ----------------------------------------
    // Create StudyHub order ID
    // ----------------------------------------

    const orderId =
      `studyhub_${Date.now()}`;

    // ----------------------------------------
    // Create Cashfree order
    // ----------------------------------------

    const cashfreeResponse =
      await fetch(
        CASHFREE_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "x-client-id":
              CASHFREE_APP_ID,

            "x-client-secret":
              CASHFREE_SECRET_KEY,

            "x-api-version":
              "2025-01-01",
          },

          body: JSON.stringify({
            order_id: orderId,

            order_amount:
              Number(amount),

            order_currency: "INR",

            customer_details: {
              customer_id:
                customer_id ||
                `customer_${Date.now()}`,

              customer_name:
                customer_name,

              customer_email:
                customer_email,

              customer_phone:
                customer_phone,
            },

            order_meta: {
              return_url:
                "https://studyhub-git-main-shoaib-s-projects-2bd5116e.vercel.app/payment-success?order_id={order_id}",
            },
          }),
        }
      );

    const data =
      await cashfreeResponse.json();

    // ----------------------------------------
    // Cashfree error
    // ----------------------------------------

    if (!cashfreeResponse.ok) {
      console.error(
        "Cashfree API error:",
        data
      );

      return new Response(
        JSON.stringify({
          error:
            "Cashfree order creation failed.",

          details: data,
        }),
        {
          status:
            cashfreeResponse.status,

          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    // ----------------------------------------
    // Save order in Supabase
    //
    // IMPORTANT:
    // Use adminClient here instead of userClient
    // to avoid the RLS INSERT problem.
    // ----------------------------------------

    const {
      error: orderInsertError,
    } = await adminClient
      .from("orders")
      .insert({
        order_id: orderId,

        user_id: user.id,

        amount: Number(amount),

        items: items,

        status: "CREATED",
      });

    if (orderInsertError) {
      console.error(
        "Order database error:",
        orderInsertError
      );

      return new Response(
        JSON.stringify({
          error:
            "Order was created but could not be saved.",

          details:
            orderInsertError.message,
        }),
        {
          status: 500,

          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    // ----------------------------------------
    // Success
    // ----------------------------------------

    return new Response(
      JSON.stringify({
        success: true,

        order_id:
          data.order_id,

        payment_session_id:
          data.payment_session_id,
      }),
      {
        status: 200,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Create Cashfree order error:",
      error
    );

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
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});