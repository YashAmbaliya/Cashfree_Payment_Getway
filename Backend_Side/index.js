const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

const cors = require("cors");
const axios = require("axios");

// const APP_ID = "TEST10220205bf31035d5ee4ad44736b50202201";
// const SECRET_KEY = "cfsk_ma_test_f109289fc54a49205bad9700276d27de_a7386657";

//  For Testing
// const BASE_URL = "https://sandbox.cashfree.com/pg/orders";
//  For Production
// const BASE_URL = "https://api.cashfree.com/pg/orders"

app.use(bodyParser.json());

app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.post("/api/createOrder", (req, res) => {
	try {
		const options = {
			method: "POST",
			url: req.body.BaseUrl,
			headers: {
				accept: "application/json",
				"x-api-version": "2023-08-01",
				"content-type": "application/json",
				"x-client-id": req.body.AppId,
				"x-client-secret": req.body.SecretKey,
			},
			data: {
				customer_details: {
					customer_id: "customer" + Date.now(),
					customer_email: req.body.UserEmail,
					customer_phone: req.body.UserMobile,
					customer_name: req.body.UserName,
				},
				order_id: "order" + Date.now(),
				order_amount: req.body.OrderAmount,
				order_currency: "INR",
				order_note: req.body.OrderDesc,
				order_meta: {
					return_url: `${req.body.ReturnUrl}/${"order" + Date.now()}`,
				},
			},
		};

		axios
			.request(options)
			.then(function (response) {
				console.log(response.data);
				res.status(200).json({
					payment_id: response.data.payment_session_id,
					order_id: response.data.order_id,
					msg: "Order Created",
				});
			})
			.catch(function (error) {
				console.error(error);
				res.status(500).json({
					error: error,
					msg: "Order Not Created !!!",
				});
			});
	} catch (error) {
		res.status(500).json({ msg: "Error in Creating Order" });
	}
});

app.post("/api/status/:order_id", (req, res) => {
	const orderId = req.params.order_id;
	try {
		const options = {
			method: "GET",
			url: `${req.body.BaseUrl}/${orderId}`,
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				"x-api-version": "2023-08-01",
				"x-client-id": req.body.AppId,
				"x-client-secret": req.body.SecretKey,
			},
		};

		axios
			.request(options)
			.then(function (response) {
				console.log(response.data);

				res.status(200).json({
					data: response.data,
					msg: "Order Verified Successfully",
				});
			})
			.catch(function (error) {
				console.error(error);
				res.status(500).json({
					error: error,
					msg: "Order Not Verified !!!",
				});
			});
	} catch (error) {
		res.status(500).json({ msg: "Error in Verifying Order" });
	}
});

app.listen(port, () => {
	console.log(`Server running at http://127.0.0.1:${port}/`);
});
