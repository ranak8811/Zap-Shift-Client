import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { parcelId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      const data = res.data;
      return data;
    },
  });

  if (isPending) {
    return <progress className="progress w-56"></progress>;
  }

  console.log(parcelInfo);
  const amount = parcelInfo.cost;
  const amountInCents = Math.floor(amount * 100);
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setError(error.message);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setError(null);

      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      console.log("res from intent: ", res);

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName || "Anonymous",
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          console.log("payment successful");
          setError(null);

          const transactionId = result.paymentIntent.id;
          // TODO: Send data to server

          const paymentData = {
            parcelId,
            email: user.email,
            amount,
            transactionId: transactionId,
            paymentMethod: result.paymentIntent.payment_method_types,
          };

          try {
            const paymentRes = await axiosSecure.post("/payments", paymentData);

            if (res.data.insertedId) {
              if (paymentRes.data.insertedId) {
                // ✅ Show SweetAlert with transaction ID
                await Swal.fire({
                  icon: "success",
                  title: "Payment Successful!",
                  html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
                  confirmButtonText: "Go to My Parcels",
                });

                // ✅ Redirect to /myParcels
                navigate("/dashboard/myParcels");
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          type="submit"
          className="btn btn-primary text-black w-full"
          disabled={!stripe}
        >
          Pay ${amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
