<template>
  <div
    class="text-center w-full h-screen bg-purple-200 flex items-center justify-center flex-col py-10"
  >
    <h2 class="text-3xl font-semibold">CashFree Payment Form</h2>

    <div
      class="w-[520px] bg-slate-300 h-fit flex items-center justify-center flex-col px-5 py-10 mt-8 rounded-md"
    >
      <form
        action="#"
        class="w-full flex items-start justify-center flex-col gap-1"
      >
        <label for="u_name" class="text-sm font-semibold">User Name:</label>
        <input
          type="text"
          class="w-full text-md py-1 px-2 outline-none border-none rounded-md"
          id="u_name"
          placeholder="Enter Your Name"
          v-model="user_name"
        />
        <label for="u_mobile" class="text-sm font-semibold mt-4"
          >Mobile Number:</label
        >
        <input
          type="text"
          class="w-full text-md py-1 px-2 outline-none border-none rounded-md"
          id="u_mobile"
          placeholder="Enter Mobile Number"
          v-model="user_mobile"
        />
        <label for="u_email" class="text-sm font-semibold mt-4"
          >Email-ID:</label
        >
        <input
          type="text"
          class="w-full text-md py-1 px-2 outline-none border-none rounded-md"
          id="u_email"
          placeholder="Enter Email-Id"
          v-model="user_email"
        />

        <label for="u_amount" class="text-sm font-semibold mt-4">Amount:</label>
        <input
          type="text"
          class="w-full text-md py-1 px-2 outline-none border-none rounded-md"
          id="u_amount"
          placeholder="Enter Amount"
          v-model="amount"
        />

        <label for="order_desc" class="text-sm font-semibold mt-4"
          >Order Description:</label
        >
        <input
          type="text"
          class="w-full text-md py-1 px-2 outline-none border-none rounded-md"
          id="order_desc"
          placeholder="Enter Order Description"
          v-model="order_desc"
        />

        <button
          type="button"
          class="w-full mt-10 px-5 py-2 rounded-md bg-purple-500 text-xl text-white hover:bg-purple-600"
          @click.prevent="payNow()"
        >
          Pay Now
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

export default {
  name: "HomePage",
  data() {
    return {
      user_name: "",
      user_mobile: "",
      user_email: "",
      amount: "",
      order_desc: "",
      BACKEND_URL: "http://127.0.0.1:5000/",
      cashfree: null,
      AppId: "", // Pass here your cash free app id
      SecretKey: "", // Pass here your cash free secret key here
      BaseUrl: "https://sandbox.cashfree.com/pg/orders", // For Testing
      // BaseUrl: 'https://api.cashfree.com/pg/orders',  // For Production
      ReturnUrl: "", // Pass here your return page url of your project eg. http://localhost:1234/result
    };
  },
  methods: {
    makePayment(paymentId) {
      if (!this.cashfree) {
        console.log("Cashfree SDK not initialized yet");
        return;
      }

      try {
        this.cashfree
          .checkout({
            paymentSessionId: paymentId,
            redirectTarget: "_self",
          })
          .then((result) => {
            if (result.error) {
              console.log(
                "User has closed the popup or there is some payment error, Check for Payment Status"
              );
              console.log(result.error);
            }
            if (result.redirect) {
              console.log("Payment will be redirected");
            }
            if (result.paymentDetails) {
              console.log(
                "Payment has been completed, Check for Payment Status"
              );

              console.log(result.paymentDetails.paymentMessage);
            }
          });
      } catch (error) {
        console.log("Error opening Cashfree checkout:", error);
      }
    },
    payNow() {
      axios
        .post(`${this.BACKEND_URL}api/createOrder`, {
          AppId: this.AppId,
          SecretKey: this.SecretKey,
          BaseUrl: this.BaseUrl,
          ReturnUrl: this.ReturnUrl,
          UserName: this.user_name,
          UserEmail: this.user_email,
          UserMobile: this.user_mobile,
          OrderAmount: this.amount,
          OrderDesc: this.order_desc,
        })
        .then((res) => {
          console.log("Response From Create Order: ", res);
          this.makePayment(res.data.payment_id);
        })
        .catch((err) => {
          console.log("Error From Create Order: ", err);
        });
    },
  },
  async mounted() {
    try {
      this.cashfree = await load({ mode: "sandbox" }); // Change mode here as per your need of use for testing "sandbox", for prodction "production"
    } catch (error) {
      console.log("Error initializing Cashfree:", error);
    }
  },
};
</script>

<style scoped>
</style>
