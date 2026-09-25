
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <main className="page-container">
      <div className="payment-success-card">
        <h1>Payment Processing</h1>

        <p>
          Your payment has been submitted successfully.
        </p>

        {orderId && (
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
        )}

        <p>
          We are verifying your payment. Please wait.
        </p>

        <Link to="/my-library">
          Go to My Library
        </Link>
      </div>
    </main>
  );
}

export default PaymentSuccess;