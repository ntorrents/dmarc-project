import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	Shield,
	ArrowRight,
	User,
	Building,
	Check,
} from "lucide-react";

const Signup = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		company: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
		subscribeNewsletter: true,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(1);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			console.log("Signup attempt:", formData);
			setIsLoading(false);
			// Redirect to dashboard after successful signup
			navigate("/dashboard");
		}, 2000);
	};

	const validatePassword = () => {
		return (
			formData.password.length >= 8 &&
			formData.password === formData.confirmPassword
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-16">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center">
					<Link to="/" className="inline-flex items-center space-x-2 mb-8">
						<div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg">
							<Shield className="w-7 h-7 text-white" />
						</div>
						<span className="text-2xl font-bold text-white">
							Safe<span className="text-primary-400">DMARC</span>
						</span>
					</Link>
					<h2 className="text-3xl font-bold text-white mb-2">
						Start Your Free Trial
					</h2>
					<p className="text-gray-300">
						Create your account and protect your email domain in minutes
					</p>
				</motion.div>

				{/* Benefits */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
					<h3 className="text-white font-semibold mb-3">What you get:</h3>
					<ul className="space-y-2 text-sm text-gray-300">
						<li className="flex items-center">
							<Check className="w-4 h-4 text-primary-400 mr-2" />
							14-day free trial, no credit card required
						</li>
						<li className="flex items-center">
							<Check className="w-4 h-4 text-primary-400 mr-2" />
							Complete DMARC analysis and setup
						</li>
						<li className="flex items-center">
							<Check className="w-4 h-4 text-primary-400 mr-2" />
							24/7 expert support
						</li>
					</ul>
				</motion.div>

				{/* Signup Form */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-white rounded-xl shadow-2xl p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name Fields */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-gray-700 mb-2">
									First Name
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<User className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="firstName"
										name="firstName"
										type="text"
										required
										value={formData.firstName}
										onChange={handleChange}
										className="input-field pl-10"
										placeholder="First name"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-gray-700 mb-2">
									Last Name
								</label>
								<input
									id="lastName"
									name="lastName"
									type="text"
									required
									value={formData.lastName}
									onChange={handleChange}
									className="input-field"
									placeholder="Last name"
								/>
							</div>
						</div>

						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2">
								Work Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="input-field pl-10"
									placeholder="Enter your work email"
								/>
							</div>
						</div>

						{/* Company Field */}
						<div>
							<label
								htmlFor="company"
								className="block text-sm font-medium text-gray-700 mb-2">
								Company Name
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Building className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="company"
									name="company"
									type="text"
									required
									value={formData.company}
									onChange={handleChange}
									className="input-field pl-10"
									placeholder="Your company name"
								/>
							</div>
						</div>

						{/* Password Fields */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									value={formData.password}
									onChange={handleChange}
									className="input-field pl-10 pr-10"
									placeholder="Create a strong password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center">
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									) : (
										<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>
							<p className="text-xs text-gray-500 mt-1">
								Must be at least 8 characters long
							</p>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 mb-2">
								Confirm Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									required
									value={formData.confirmPassword}
									onChange={handleChange}
									className="input-field pl-10 pr-10"
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center">
									{showConfirmPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									) : (
										<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>
						</div>

						{/* Checkboxes */}
						<div className="space-y-3">
							<div className="flex items-start">
								<input
									id="agreeToTerms"
									name="agreeToTerms"
									type="checkbox"
									required
									checked={formData.agreeToTerms}
									onChange={handleChange}
									className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
								/>
								<label
									htmlFor="agreeToTerms"
									className="ml-2 block text-sm text-gray-700">
									I agree to the{" "}
									<Link
										to="/terms"
										className="text-primary-600 hover:underline">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										to="/privacy"
										className="text-primary-600 hover:underline">
										Privacy Policy
									</Link>
								</label>
							</div>
							<div className="flex items-start">
								<input
									id="subscribeNewsletter"
									name="subscribeNewsletter"
									type="checkbox"
									checked={formData.subscribeNewsletter}
									onChange={handleChange}
									className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
								/>
								<label
									htmlFor="subscribeNewsletter"
									className="ml-2 block text-sm text-gray-700">
									Send me email security tips and product updates
								</label>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={
								isLoading || !validatePassword() || !formData.agreeToTerms
							}
							className="btn-primary w-full group disabled:opacity-50 disabled:cursor-not-allowed">
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Creating Account...
								</div>
							) : (
								<>
									Start Free Trial
									<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
								</>
							)}
						</button>
					</form>

					{/* Divider */}
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Already have an account?
								</span>
							</div>
						</div>
					</div>

					{/* Sign In Link */}
					<div className="mt-6 text-center">
						<Link
							to="/login"
							className="text-primary-600 hover:text-primary-500 font-medium">
							Sign in to your existing account
						</Link>
					</div>
				</motion.div>

				{/* Security Notice */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-center">
					<p className="text-sm text-gray-300">
						🔒 Your data is protected with enterprise-grade security
					</p>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default Signup;
