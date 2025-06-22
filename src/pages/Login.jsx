import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { IS_DEV } from "../lib/constants";

const Login = () => {
	const navigate = useNavigate();
	const { login } = useAuthContext();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		// Clear error when user starts typing
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			if (!formData.email || !formData.password) {
				setError("Please fill in all fields");
				return;
			}

			await login(formData);
			navigate("/dashboard");
		} catch (error) {
			console.error("Login error:", error);
			
			if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
				setError("Cannot connect to backend server. Please ensure your backend is running at the configured URL.");
			} else {
				setError(error.message || "Login failed. Please check your credentials.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
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
					<h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
					<p className="text-gray-300">
						Sign in to your account to continue protecting your email domain
					</p>
					{IS_DEV && (
						<div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
							<p className="text-yellow-200 text-sm">
								🔧 Development Mode: Using mock data
							</p>
						</div>
					)}
				</motion.div>

				{/* Login Form */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="bg-white rounded-xl shadow-2xl p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
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
									placeholder="Enter your email address"
								/>
							</div>
						</div>

						{/* Password Field */}
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
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={handleChange}
									className="input-field pl-10 pr-10"
									placeholder="Enter your password"
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
						</div>

						{/* Error Message */}
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-800">{error}</p>
							</motion.div>
						)}

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="rememberMe"
									name="rememberMe"
									type="checkbox"
									checked={formData.rememberMe}
									onChange={handleChange}
									className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="rememberMe"
									className="ml-2 block text-sm text-gray-700">
									Remember me
								</label>
							</div>
							<Link
								to="/forgot-password"
								className="text-sm text-primary-600 hover:text-primary-500 font-medium">
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="btn-primary w-full group disabled:opacity-50 disabled:cursor-not-allowed">
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Signing in...
								</div>
							) : (
								<>
									Sign In
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
									New to SafeDMARC?
								</span>
							</div>
						</div>
					</div>

					{/* Sign Up Link */}
					<div className="mt-6 text-center">
						<Link
							to="/signup"
							className="text-primary-600 hover:text-primary-500 font-medium">
							Create your account and start your free trial
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

export default Login;