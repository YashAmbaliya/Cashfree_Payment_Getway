<template>
  <div>
    <div
      class="w-full h-screen bg-green-400 flex items-center justify-center flex-col"
      v-if="successPayment"
    >
      <h3 class="text-3xl font-bold text-white mb-5">Payment Success</h3>
      <router-link to="/">Back to Home Page</router-link>
    </div>
    <div
      class="w-full h-screen bg-red-400 flex items-center justify-center flex-col"
      v-if="failedPayment"
    >
      <h3 class="text-3xl font-bold text-white mb-5">Payment Failed</h3>
      <router-link to="/">Back to Home Page</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResultPage",
  data() {
    return {
      successPayment: false,
      failedPayment: false,
      order_id: null,
      BACKEND_URL: "http://127.0.0.1:5000/",
      AppId: "", // Pass here your cash free app id
      SecretKey: "", // Pass here your cash free secret key here
      BaseUrl: "https://sandbox.cashfree.com/pg/orders", // For Testing
      // BaseUrl: 'https://api.cashfree.com/pg/orders',  // For Production
    };
  },
  mounted() {
    this.order_id = this.$route.params.order_id;
    console.log("Order Id: ", this.order_id);

    axios
      .post(`${this.BACKEND_URL}api/status/${this.order_id}`, {
        AppId: this.AppId,
        SecretKey: this.SecretKey,
        BaseUrl: this.BaseUrl,
      })
      .then((res) => {
        console.log("Response of Verifying Order: ", res);
        if (res.data.data.order_status == "PAID") {
          this.successPayment = true;
          this.failedPayment = false;
        } else {
          this.successPayment = false;
          this.failedPayment = true;
        }
      })
      .catch((err) => {
        console.log("Error From Verifying Order: ", err);
      });
  },
};
</script>

<style scoped>
</style>
