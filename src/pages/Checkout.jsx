import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Shield, CreditCard, Lock } from "lucide-react";

const Checkout = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const selectedPlan = params.get("plan") || "Standard";

	const [billingCycle, setBillingCycle] = useState("monthly");
	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		company: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		billingAddress: "",
		city: "",
		zipCode: "",
		country: "US",
	});

	const planDetails = {
		Basic: {
			monthlyPrice: 49,
			yearlyPrice: 490,
			features: [
				"1 Domain",
				"1 User",
				"Weekly Email Reports",
				"DMARC Policy: Monitor",
				"Email Support",
			],
		},
		Standard: {
			monthlyPrice: 99,
			yearlyPrice: 990,
			features: [
				"3 Domains",
				"5 Users",
				"Daily Email Reports",
				"DMARC Policy: Quarantine",
				"Email & Chat Support",
				"API Access",
				"Custom Reports",
			],
		},
		Premium: {
			monthlyPrice: 249,
			yearlyPrice: 2490,
			features: [
				"Unlimited Domains",
				"10 Users",
				"Real-time Email Reports",
				"DMARC Policy: Reject",
				"Priority Support",
				"Full API Access",
				"Dedicated Account Manager",
			],
		},
	};

	const currentPlan = planDetails[selectedPlan] || planDetails.Standard;
	const price =
		billingCycle === "monthly"
			? currentPlan.monthlyPrice
			: currentPlan.yearlyPrice;
	const savings =
		billingCycle === "yearly"
			? currentPlan.monthlyPrice * 12 - currentPlan.yearlyPrice
			: 0;

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Checkout submitted:", {
			plan: selectedPlan,
			billingCycle,
			formData,
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="pt-20 min-h-screen bg-gray-50">
			<div className="container-custom section-padding">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-12">
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Complete Your Order
						</h1>
						<p className="text-xl text-gray-600">
							You are just one step away from securing your email communications
						</p>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Order Summary */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}>
							<div className="card sticky top-8">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">
									Order Summary
								</h2>

								<div className="border-b border-gray-200 pb-6 mb-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-lg font-semibold text-gray-900">
											{selectedPlan} Plan
										</h3>
										<div className="flex items-center space-x-2">
											<Shield className="w-5 h-5 text-primary-600" />
											<span className="text-sm text-primary-600 font-medium">
												Most Popular
											</span>
										</div>
									</div>

									{/* Billing Cycle Toggle */}
									<div className="bg-gray-50 rounded-lg p-4 mb-6">
										<div className="flex items-center justify-between mb-4">
											<span className="font-medium text-gray-900">
												Billing Cycle
											</span>
											{billingCycle === "yearly" && (
												<span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
													Save ${savings}
												</span>
											)}
										</div>
										<div className="grid grid-cols-2 gap-2">
											<button
												onClick={() => setBillingCycle("monthly")}
												className={`p-3 rounded-lg text-sm font-medium transition-colors ${
													billingCycle === "monthly"
														? "bg-primary-600 text-white"
														: "bg-white text-gray-700 border border-gray-300"
												}`}>
												Monthly
											</button>
											<button
												onClick={() => setBillingCycle("yearly")}
												className={`p-3 rounded-lg text-sm font-medium transition-colors ${
													billingCycle === "yearly"
														? "bg-primary-600 text-white"
														: "bg-white text-gray-700 border border-gray-300"
												}`}>
												Yearly (Save 17%)
											</button>
										</div>
									</div>

									<ul className="space-y-3">
										{currentPlan.features.map((feature, index) => (
											<li key={index} className="flex items-center">
												<Check className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
												<span className="text-gray-700">{feature}</span>
											</li>
										))}
									</ul>
								</div>

								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-gray-600">
											{selectedPlan} Plan ({billingCycle})
										</span>
										<span className="font-medium">${price}</span>
									</div>
									{billingCycle === "yearly" && (
										<div className="flex justify-between text-green-600">
											<span>Yearly Discount</span>
											<span>-${savings}</span>
										</div>
									)}
									<div className="border-t border-gray-200 pt-3">
										<div className="flex justify-between text-lg font-bold">
											<span>Total</span>
											<span>${price}</span>
										</div>
										<p className="text-sm text-gray-500 mt-1">
											{billingCycle === "monthly"
												? "Billed monthly"
												: "Billed annually"}
										</p>
									</div>
								</div>

								<div className="mt-6 p-4 bg-primary-50 rounded-lg">
									<div className="flex items-center">
										<Lock className="w-5 h-5 text-primary-600 mr-2" />
										<span className="text-sm text-primary-700 font-medium">
											30-day money-back guarantee
										</span>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Checkout Form */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}>
							<div className="card">
								<h2 className="text-2xl font-bold text-gray-900 mb-6">
									Payment Information
								</h2>

								<form onSubmit={handleSubmit} className="space-y-6">
									{/* Account Information */}
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-4">
											Account Information
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													First Name *
												</label>
												<input
													type="text"
													name="firstName"
													value={formData.firstName}
													onChange={handleInputChange}
													required
													className="input-field"
													placeholder="Enter first name"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Last Name *
												</label>
												<input
													type="text"
													name="lastName"
													value={formData.lastName}
													onChange={handleInputChange}
													required
													className="input-field"
													placeholder="Enter last name"
												/>
											</div>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Email Address *
												</label>
												<input
													type="email"
													name="email"
													value={formData.email}
													onChange={handleInputChange}
													required
													className="input-field"
													placeholder="Enter email address"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Company
												</label>
												<input
													type="text"
													name="company"
													value={formData.company}
													onChange={handleInputChange}
													className="input-field"
													placeholder="Enter company name"
												/>
											</div>
										</div>
									</div>

									{/* Payment Method */}
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-4">
											Payment Method
										</h3>
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Card Number *
												</label>
												<div className="relative">
													<input
														type="text"
														name="cardNumber"
														value={formData.cardNumber}
														onChange={handleInputChange}
														required
														className="input-field pr-12"
														placeholder="1234 5678 9012 3456"
													/>
													<CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Expiry Date *
													</label>
													<input
														type="text"
														name="expiryDate"
														value={formData.expiryDate}
														onChange={handleInputChange}
														required
														className="input-field"
														placeholder="MM/YY"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														CVV *
													</label>
													<input
														type="text"
														name="cvv"
														value={formData.cvv}
														onChange={handleInputChange}
														required
														className="input-field"
														placeholder="123"
													/>
												</div>
											</div>
										</div>
									</div>

									{/* Billing Address */}
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-4">
											Billing Address
										</h3>
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Address *
												</label>
												<input
													type="text"
													name="billingAddress"
													value={formData.billingAddress}
													onChange={handleInputChange}
													required
													className="input-field"
													placeholder="Enter billing address"
												/>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														City *
													</label>
													<input
														type="text"
														name="city"
														value={formData.city}
														onChange={handleInputChange}
														required
														className="input-field"
														placeholder="Enter city"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														ZIP Code *
													</label>
													<input
														type="text"
														name="zipCode"
														value={formData.zipCode}
														onChange={handleInputChange}
														required
														className="input-field"
														placeholder="12345"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Country *
													</label>
													<select
														name="country"
														value={formData.country}
														onChange={handleInputChange}
														required
														className="input-field">
														<option value="US">United States</option>
														<option value="CA">Canada</option>
														<option value="UK">United Kingdom</option>
														<option value="AU">Australia</option>
													</select>
												</div>
											</div>
										</div>
									</div>

									<button
										type="submit"
										className="btn-primary w-full text-lg py-4">
										Complete Order - ${price}
									</button>

									<div className="text-center">
										<p className="text-sm text-gray-500">
											By completing this order, you agree to our{" "}
											<a href="#" className="text-primary-600 hover:underline">
												Terms of Service
											</a>{" "}
											and{" "}
											<a href="#" className="text-primary-600 hover:underline">
												Privacy Policy
											</a>
										</p>
									</div>
								</form>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default Checkout;
