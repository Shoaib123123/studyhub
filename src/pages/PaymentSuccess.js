import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useCart from "../hooks/useCart";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const { clearCart } = useCart();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "We are verifying your payment. Please wait..."
  );

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId) {
        setStatus("error");
        setMessage("Payment order ID was not found.");
        return;
      }

      try {
        const { data, error } =
          await supabase.functions.invoke(
            "verify-cashfree-payment",
            {
              body: {
                order_id: orderId,
              },
            }
          );

        if (error) {
          console.error(
            "Payment verification error:",
            error
          );

          throw new Error(
            error.message ||
              "Unable to verify payment."
          );
        }

        console.log(
          "Payment verification response:",
          data
        );

        if (
          data?.success &&
          data?.status === "PAID"
        ) {
          // Clear cart only after payment is verified
          clearCart();

          setStatus("success");

          setMessage(
            "Payment successful! Your purchased book has been added to your library."
          );
        } else {
          setStatus("pending");

          setMessage(
            data?.message ||
              "Your payment is still being processed."
          );
        }
      } catch (err) {
        console.error(
          "Payment verification error:",
          err
        );

        setStatus("error");

        setMessage(
          err.message ||
            "Something went wrong while verifying your payment."
        );
      }
    }

    verifyPayment();
  }, [orderId, clearCart]);

  return (
    <main className="page-container">
      <div className="payment-success-card">

        {/* VERIFYING */}
        {status === "verifying" && (
          <>
            <h1>Payment Processing</h1>

            <p>
              Your payment has been submitted
              successfully.
            </p>

            {orderId && (
              <p>
                <strong>Order ID:</strong>{" "}
                {orderId}
              </p>
            )}

            <p>{message}</p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <h1>Payment Successful 🎉</h1>

            <p>{message}</p>

            {orderId && (
              <p>
                <strong>Order ID:</strong>{" "}
                {orderId}
              </p>
            )}

            <Link to="/my-library">
              Go to My Library
            </Link>
          </>
        )}

        {/* PENDING */}
        {status === "pending" && (
          <>
            <h1>Payment Pending</h1>

            <p>{message}</p>

            {orderId && (
              <p>
                <strong>Order ID:</strong>{" "}
                {orderId}
              </p>
            )}

            <Link to="/my-library">
              Check My Library
            </Link>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <h1>Payment Verification Failed</h1>

            <p>{message}</p>

            {orderId && (
              <p>
                <strong>Order ID:</strong>{" "}
                {orderId}
              </p>
            )}

            <Link to="/cart">
              Return to Cart
            </Link>
          </>
        )}

      </div>
    </main>
  );
}

export default PaymentSuccess;