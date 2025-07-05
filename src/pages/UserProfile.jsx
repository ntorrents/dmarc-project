import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	User,
	Mail,
	Lock,
	Building,
	Save,
	Eye,
	EyeOff,
	Shield,
	Users,
	MapPin,
	Calendar,
	Phone,
} from "lucide-react";
import { authAPI } from "../lib/api/auth";
import { companiesAPI } from "../lib/api/companies";
import { validateEmail, sanitizeInput, getErrorMessage } from "../lib/helpers";
import { useAuthContext } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const UserProfile = () => {
	const { user, updateProfile } = useAuthContext();
	const { success, error: showError } = useNotification();

	const [profile, setProfile] = useState({
		firstName: "",
		lastName: "",
		email: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [enterpriseInfo, setEnterpriseInfo] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		activeUsers: 0,
		totalDomains: 0,
		createdAt: "",
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	useEffect(() => {
		loadProfile();
	}, [user]);

	const loadProfile = async () => {
		try {
			setLoading(true);
			setError(null);

			// Get user data from context or API
			let profileData = user;
			if (!profileData) {
				profileData = await authAPI.getProfile();
			}

			// Set profile data using real user information
			setProfile({
				firstName: profileData.first_name || "",
				lastName: profileData.last_name || "",
				email: profileData.email || "",
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});

			// Try to get enterprise/company data
			try {
				const companyData = await companiesAPI.get();
				setEnterpriseInfo({
					name: companyData.name || "N/A",
					email: companyData.email || "N/A",
					phone: companyData.phone || "N/A",
					address: companyData.address || "N/A",
					activeUsers: companyData.active_users || 0,
					totalDomains: companyData.total_domains || 0,
					createdAt: companyData.created_at || "",
				});
			} catch (companyError) {
				console.log("Could not load company data:", companyError);
				// Set default values if company data is not available
				setEnterpriseInfo({
					name: "Not Available",
					email: "Not Available",
					phone: "Not Available",
					address: "Not Available",
					activeUsers: 0,
					totalDomains: 0,
					createdAt: "",
				});
			}
		} catch (err) {
			console.error("Error loading profile:", err);
			setError(getErrorMessage(err));
		} finally {
			setLoading(false);
		}
	};

	const handleProfileChange = (field, value) => {
		setProfile((prev) => ({
			...prev,
			[field]: sanitizeInput(value),
		}));

		if (error) setError(null);
	};

	const handleSaveProfile = async () => {
		try {
			setError(null);
			setSaving(true);

			// Validation
			if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.email.trim()) {
				setError("First name, last name, and email are required");
				return;
			}

			if (!validateEmail(profile.email)) {
				setError("Please enter a valid email address");
				return;
			}

			// Password validation if changing password
			if (profile.newPassword) {
				if (!profile.currentPassword) {
					setError("Current password is required to set a new password");
					return;
				}

				if (profile.newPassword.length < 8) {
					setError("New password must be at least 8 characters long");
					return;
				}

				if (profile.newPassword !== profile.confirmPassword) {
					setError("New passwords do not match");
					return;
				}

				if (profile.newPassword === profile.currentPassword) {
					setError("New password must be different from current password");
					return;
				}
			}

			// Prepare update data
			const updateData = {
				first_name: profile.firstName,
				last_name: profile.lastName,
				email: profile.email,
			};

			// Add password change if requested
			if (profile.newPassword) {
				updateData.current_password = profile.currentPassword;
				updateData.password = profile.newPassword;
			}

			// Call API to update profile
			const updatedUser = await authAPI.updateProfile(updateData);

			// Update the context with new user data
			await updateProfile(updatedUser);

			success("Profile updated successfully!");

			// Clear password fields
			setProfile((prev) => ({
				...prev,
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			}));
		} catch (err) {
			console.error("Error saving profile:", err);
			const errorMessage = getErrorMessage(err);
			setError(errorMessage);
			showError("Failed to update profile", errorMessage);
		} finally {
			setSaving(false);
		}
	};

	const togglePasswordVisibility = (field) => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getFullName = () => {
		if (profile.firstName && profile.lastName) {
			return `${profile.firstName} ${profile.lastName}`;
		}
		return user?.username || user?.name || "User";
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="min-h-screen bg-gray-50 pt-3">
			<div className="container-custom py-6">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
					<p className="text-gray-600 mt-1">
						Welcome, {getFullName()}! Manage your account settings and view enterprise information.
					</p>
				</motion.div>

				{/* Error Display */}
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-800">{error}</p>
						<button
							onClick={() => setError(null)}
							className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
							Dismiss
						</button>
					</motion.div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Personal Information */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
							<User className="w-6 h-6 mr-2" />
							Personal Information
						</h2>

						<div className="space-y-6">
							{/* First Name */}
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-gray-700 mb-2">
									First Name
								</label>
								<input
									type="text"
									id="firstName"
									value={profile.firstName}
									onChange={(e) => handleProfileChange("firstName", e.target.value)}
									className="input-field"
									placeholder="Enter your first name"
								/>
							</div>

							{/* Last Name */}
							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-gray-700 mb-2">
									Last Name
								</label>
								<input
									type="text"
									id="lastName"
									value={profile.lastName}
									onChange={(e) => handleProfileChange("lastName", e.target.value)}
									className="input-field"
									placeholder="Enter your last name"
								/>
							</div>

							{/* Email */}
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
										type="email"
										id="email"
										value={profile.email}
										onChange={(e) =>
											handleProfileChange("email", e.target.value)
										}
										className="input-field pl-10"
										placeholder="Enter your email address"
									/>
								</div>
							</div>

							{/* Password Section */}
							<div className="pt-6 border-t border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Change Password
								</h3>

								{/* Current Password */}
								<div className="mb-4">
									<label
										htmlFor="currentPassword"
										className="block text-sm font-medium text-gray-700 mb-2">
										Current Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Lock className="h-5 w-5 text-gray-400" />
										</div>
										<input
											type={showPasswords.current ? "text" : "password"}
											id="currentPassword"
											value={profile.currentPassword}
											onChange={(e) =>
												handleProfileChange("currentPassword", e.target.value)
											}
											className="input-field pl-10 pr-10"
											placeholder="Enter current password"
										/>
										<button
											type="button"
											onClick={() => togglePasswordVisibility("current")}
											className="absolute inset-y-0 right-0 pr-3 flex items-center">
											{showPasswords.current ? (
												<EyeOff className="h-5 w-5 text-gray-400" />
											) : (
												<Eye className="h-5 w-5 text-gray-400" />
											)}
										</button>
									</div>
								</div>

								{/* New Password */}
								<div className="mb-4">
									<label
										htmlFor="newPassword"
										className="block text-sm font-medium text-gray-700 mb-2">
										New Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Lock className="h-5 w-5 text-gray-400" />
										</div>
										<input
											type={showPasswords.new ? "text" : "password"}
											id="newPassword"
											value={profile.newPassword}
											onChange={(e) =>
												handleProfileChange("newPassword", e.target.value)
											}
											className="input-field pl-10 pr-10"
											placeholder="Enter new password"
										/>
										<button
											type="button"
											onClick={() => togglePasswordVisibility("new")}
											className="absolute inset-y-0 right-0 pr-3 flex items-center">
											{showPasswords.new ? (
												<EyeOff className="h-5 w-5 text-gray-400" />
											) : (
												<Eye className="h-5 w-5 text-gray-400" />
											)}
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Must be at least 8 characters long
									</p>
								</div>

								{/* Confirm Password */}
								<div>
									<label
										htmlFor="confirmPassword"
										className="block text-sm font-medium text-gray-700 mb-2">
										Confirm New Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Lock className="h-5 w-5 text-gray-400" />
										</div>
										<input
											type={showPasswords.confirm ? "text" : "password"}
											id="confirmPassword"
											value={profile.confirmPassword}
											onChange={(e) =>
												handleProfileChange("confirmPassword", e.target.value)
											}
											className="input-field pl-10 pr-10"
											placeholder="Confirm new password"
										/>
										<button
											type="button"
											onClick={() => togglePasswordVisibility("confirm")}
											className="absolute inset-y-0 right-0 pr-3 flex items-center">
											{showPasswords.confirm ? (
												<EyeOff className="h-5 w-5 text-gray-400" />
											) : (
												<Eye className="h-5 w-5 text-gray-400" />
											)}
										</button>
									</div>
								</div>
							</div>

							{/* Save Button */}
							<div className="flex justify-end pt-6 border-t border-gray-200">
								<button
									onClick={handleSaveProfile}
									disabled={saving}
									className="btn-primary">
									{saving ? (
										<div className="flex items-center">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Saving...
										</div>
									) : (
										<>
											<Save className="w-4 h-4 mr-2" />
											Save Profile
										</>
									)}
								</button>
							</div>
						</div>
					</motion.div>

					{/* Enterprise Information (Read-Only) */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
							<Building className="w-6 h-6 mr-2" />
							Enterprise Information
							<span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								<Shield className="w-3 h-3 mr-1" />
								Read Only
							</span>
						</h2>

						<div className="space-y-6">
							{/* Enterprise Name */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Enterprise Name
								</label>
								<div className="input-field bg-gray-50 text-gray-600 cursor-not-allowed">
									{enterpriseInfo.name}
								</div>
							</div>

							{/* Enterprise Email */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Enterprise Email
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Mail className="h-5 w-5 text-gray-400" />
									</div>
									<div className="input-field pl-10 bg-gray-50 text-gray-600 cursor-not-allowed">
										{enterpriseInfo.email}
									</div>
								</div>
							</div>

							{/* Phone */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Phone Number
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Phone className="h-5 w-5 text-gray-400" />
									</div>
									<div className="input-field pl-10 bg-gray-50 text-gray-600 cursor-not-allowed">
										{enterpriseInfo.phone}
									</div>
								</div>
							</div>

							{/* Address */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Address
								</label>
								<div className="relative">
									<div className="absolute top-3 left-3 pointer-events-none">
										<MapPin className="h-5 w-5 text-gray-400" />
									</div>
									<div className="input-field pl-10 bg-gray-50 text-gray-600 cursor-not-allowed min-h-[80px] py-3">
										{enterpriseInfo.address}
									</div>
								</div>
							</div>

							{/* Enterprise Statistics */}
							<div className="pt-6 border-t border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Enterprise Statistics
								</h3>
								
								<div className="grid grid-cols-2 gap-4">
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex items-center mb-2">
											<Users className="w-5 h-5 text-blue-600 mr-2" />
											<span className="text-sm font-medium text-gray-700">Active Users</span>
										</div>
										<div className="text-2xl font-bold text-gray-900">
											{enterpriseInfo.activeUsers}
										</div>
									</div>
									
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex items-center mb-2">
											<Shield className="w-5 h-5 text-green-600 mr-2" />
											<span className="text-sm font-medium text-gray-700">Total Domains</span>
										</div>
										<div className="text-2xl font-bold text-gray-900">
											{enterpriseInfo.totalDomains}
										</div>
									</div>
								</div>

								{enterpriseInfo.createdAt && (
									<div className="mt-4 p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center text-sm text-gray-600">
											<Calendar className="w-4 h-4 mr-2" />
											<span>Enterprise created: {formatDate(enterpriseInfo.createdAt)}</span>
										</div>
									</div>
								)}
							</div>

							{/* Note */}
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-sm text-blue-800">
									<strong>Note:</strong> Enterprise information is managed by your system administrator. 
									Contact support if you need to update these details.
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default UserProfile;