import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Shield,
	Users,
	Globe,
	BarChart3,
	Settings,
	Plus,
	CheckCircle,
	AlertTriangle,
	XCircle,
	TrendingUp,
	Mail,
} from "lucide-react";
import { domainsAPI } from "../lib/api/domains";
import { statsAPI } from "../lib/api/stats";
import { getErrorMessage } from "../lib/helpers";
import AddDomainModal from "../components/modals/AddDomainModal";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAuthContext } from "../context/AuthContext";
import { activityAPI } from "../lib/api/activity";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Link } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
	const { user } = useAuthContext();
	const [domains, setDomains] = useState([]);
	const [dashboardStats, setDashboardStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddDomain, setShowAddDomain] = useState(false);
	const [recentActivity, setRecentActivity] = useState([]);

	// Get user display name
	const getUserDisplayName = () => {
		if (user?.first_name && user?.last_name) {
			return `${user.first_name} ${user.last_name}`;
		}
		if (user?.name) {
			return user.name;
		}
		if (user?.username) {
			return user.username;
		}
		return "User";
	};

	// Generate stats from API data
	const getStats = () => {
		if (!dashboardStats) {
			return [
				{
					title: "Protected Domains",
					value: domains.length.toString(),
					icon: Globe,
					color: "text-blue-600",
					bgColor: "bg-blue-100",
				},
				{
					title: "Active Users",
					value: "Loading...",
					icon: Users,
					color: "text-green-600",
					bgColor: "bg-green-100",
				},
				{
					title: "DMARC Compliance",
					value: "Loading...",
					icon: Shield,
					color: "text-primary-600",
					bgColor: "bg-primary-100",
				},
				{
					title: "Threats Blocked",
					value: "142",
					icon: BarChart3,
					color: "text-red-600",
					bgColor: "bg-red-100",
				},
			];
		}

		return [
			{
				title: "Protected Domains",
				value: domains.length.toString(),
				icon: Globe,
				color: "text-blue-600",
				bgColor: "bg-blue-100",
			},
			{
				title: "Active Users",
				value: dashboardStats.active_users?.toString() || "0",
				icon: Users,
				color: "text-green-600",
				bgColor: "bg-green-100",
			},
			{
				title: "DMARC Compliance",
				value: dashboardStats.dmarc_compliance
					? `${Math.round(dashboardStats.dmarc_compliance)}%`
					: "0%",
				icon: Shield,
				color: "text-primary-600",
				bgColor: "bg-primary-100",
			},
			{
				title: "Threats Blocked",
				value: "142",
				icon: BarChart3,
				color: "text-red-600",
				bgColor: "bg-red-100",
			},
		];
	};

	const loadRecentActivity = async () => {
		try {
			const logs = await activityAPI.getRecentActivity();

			const transformed = logs.map((log) => ({
				id: log.id,
				user: log.user_email || log.user_username || "Unknown",
				action: log.action,
				target: log.object_repr || "-",
				time: new Date(log.timestamp),
				ip: log.ip_address || "-",
			}));

			console.log("Logs transformados:", transformed);
			setRecentActivity(transformed);
		} catch (error) {
			console.error("Error loading recent activity:", error);
			setRecentActivity([]);
		}
	};

	const loadDashboardStats = async () => {
		try {
			console.log("Loading dashboard stats...");
			const stats = await statsAPI.getDashboardStats();
			console.log("Dashboard stats loaded:", stats);
			setDashboardStats(stats);
		} catch (error) {
			console.error("Error loading dashboard stats:", error);
			// Don't show error to user, just use fallback values
		}
	};

	const loadDomains = async () => {
		try {
			setLoading(true);
			setError(null);

			// Get domains from API
			const data = await domainsAPI.list();

			// Transform API data to match UI expectations
			const transformedDomains = Array.isArray(data)
				? data.map((domain) => ({
						id: domain.id,
						name: domain.nombre || domain.name,
						status: mapDomainStatus(domain.status, domain.compliance_level),
						policy: domain.dmarc_policy || "none",
						compliance: domain.compliance_score || 0,
						lastCheck: formatLastCheck(domain.last_check),
						emails: domain.email_count || 0,
						tag: Array.isArray(domain.tags)
							? domain.tags[0]
							: domain.tag || "untagged",
				  }))
				: [];

			setDomains(transformedDomains);
		} catch (err) {
			console.error("Error loading domains:", err);
			setError(getErrorMessage(err));
		} finally {
			setLoading(false);
		}
	};

	// Helper function to map domain status
	const mapDomainStatus = (status, complianceLevel) => {
		if (status === "active" && complianceLevel === "high") return "protected";
		if (status === "active" && complianceLevel === "medium") return "warning";
		if (status === "active" && complianceLevel === "low") return "error";
		return status || "error";
	};

	// Helper function to format last check time
	const formatLastCheck = (lastCheck) => {
		if (!lastCheck) return "Never";
		const now = new Date();
		const checkTime = new Date(lastCheck);
		const diffInMinutes = Math.floor((now - checkTime) / (1000 * 60));

		if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
		if (diffInMinutes < 1440)
			return `${Math.floor(diffInMinutes / 60)} hours ago`;
		return `${Math.floor(diffInMinutes / 1440)} days ago`;
	};

	const handleAddDomain = async (domainData) => {
		try {
			// Create domain via API
			const createdDomain = await domainsAPI.create({
				nombre: domainData.name,
				description: domainData.description,
				tags: domainData.tag ? [domainData.tag] : [],
			});

			// Transform and add to local state
			const transformedDomain = {
				id: createdDomain.id,
				name: createdDomain.nombre || createdDomain.name,
				status: "warning",
				policy: "none",
				compliance: 0,
				lastCheck: "Just added",
				emails: 0,
				tag: domainData.tag || "new",
			};

			setDomains((prev) => [...prev, transformedDomain]);
			setShowAddDomain(false);

			// Log the domain creation activity
			try {
				await activityAPI.logDomainCreated(
					createdDomain.nombre || createdDomain.name,
					getUserDisplayName()
				);
				// Reload recent activity to show the new entry
				loadRecentActivity();
			} catch (error) {
				console.error("Failed to log domain creation activity:", error);
			}
		} catch (err) {
			console.error("Error adding domain:", err);
			throw err;
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "protected":
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case "warning":
				return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
			case "error":
				return <XCircle className="w-5 h-5 text-red-500" />;
			default:
				return null;
		}
	};

	const getStatusBadge = (status) => {
		switch (status) {
			case "protected":
				return "bg-green-100 text-green-800";
			case "warning":
				return "bg-yellow-100 text-yellow-800";
			case "error":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getActivityIcon = (type) => {
		switch (type) {
			case "success":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "warning":
				return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
			case "error":
				return <XCircle className="w-4 h-4 text-red-500" />;
			case "info":
				return <Users className="w-4 h-4 text-blue-500" />;
			default:
				return null;
		}
	};

	// Calculate DMARC policy distribution
	const getPolicyDistribution = () => {
		const policyCount = {
			reject: 0,
			quarantine: 0,
			none: 0,
			"no record": 0,
			invalid: 0,
		};

		domains.forEach((domain) => {
			if (
				domain.policy &&
				["reject", "quarantine", "none"].includes(domain.policy)
			) {
				policyCount[domain.policy]++;
			} else if (domain.status === "error") {
				policyCount["no record"]++;
			} else {
				policyCount["invalid"]++;
			}
		});

		return policyCount;
	};

	const policyDistribution = getPolicyDistribution();

	const doughnutData = {
		labels: ["Reject", "Quarantine", "None", "No Record", "Invalid"],
		datasets: [
			{
				data: [
					policyDistribution.reject,
					policyDistribution.quarantine,
					policyDistribution.none,
					policyDistribution["no record"],
					policyDistribution.invalid,
				],
				backgroundColor: [
					"#10b981", // green for reject (best)
					"#f59e0b", // yellow for quarantine (medium)
					"#ef4444", // red for none (poor)
					"#6b7280", // gray for no record
					"#dc2626", // dark red for invalid
				],
				borderColor: ["#059669", "#d97706", "#dc2626", "#4b5563", "#b91c1c"],
				borderWidth: 2,
				hoverOffset: 4,
			},
		],
	};

	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					padding: 20,
					usePointStyle: true,
					font: {
						size: 12,
					},
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const label = context.label || "";
						const value = context.parsed || 0;
						const total = context.dataset.data.reduce((a, b) => a + b, 0);
						const percentage =
							total > 0 ? ((value / total) * 100).toFixed(1) : 0;
						return `${label}: ${value} domains (${percentage}%)`;
					},
				},
			},
		},
	};

	useEffect(() => {
		loadDomains();
		loadRecentActivity();
		loadDashboardStats();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading dashboard...</p>
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
				{/* Welcome Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-6">
					<div className="bg-gradient-primary rounded-xl p-4 text-white max-w-1xl">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-xl md:text-2xl font-bold mb-1">
									Welcome back, {getUserDisplayName()}!
								</h1>
								<p className="text-primary-100 text-sm">
									Here is your email security overview for today
								</p>
							</div>
							<div className="hidden md:block">
								<Shield className="w-12 h-12 text-primary-200" />
							</div>
						</div>
					</div>
				</motion.div>

				{/* Error Display */}
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-800">{error}</p>
						<button
							onClick={loadDomains}
							className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
							Try again
						</button>
					</motion.div>
				)}

				{/* Stats Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{getStats().map((stat) => (
						<div
							key={stat.title}
							className="card hover:shadow-xl transition-shadow duration-300">
							<div className="flex items-center justify-between mb-4">
								<div
									className={`flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-lg`}>
									<stat.icon className={`w-6 h-6 ${stat.color}`} />
								</div>
								<TrendingUp className="w-4 h-4 text-green-500" />
							</div>
							<div>
								<p className="text-sm font-medium text-gray-600 mb-1">
									{stat.title}
								</p>
								<p className="text-2xl font-bold text-gray-900 mb-1">
									{stat.value}
								</p>
							</div>
						</div>
					))}
				</motion.div>

				{/* First Row: Domain Protection Status + DMARC Policy Distribution */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
					{/* Domain Protection Status - 2/3 width */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="lg:col-span-2">
						<div className="card h-full">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold text-gray-900">
									Domain Protection Status
								</h2>
								<button
									onClick={() => setShowAddDomain(true)}
									className="btn-primary">
									<Plus className="w-4 h-4 mr-2" />
									Add Domain
								</button>
							</div>

							<div className="space-y-4">
								{domains.map((domain) => (
									<div
										key={domain.id}
										className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center space-x-3">
												{getStatusIcon(domain.status)}
												<div>
													<h3 className="font-semibold text-gray-900">
														{domain.name}
													</h3>
													<p className="text-sm text-gray-500">
														Policy: {domain.policy} • {domain.emails} emails
														processed
													</p>
												</div>
											</div>
											<div className="text-right">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
														domain.status
													)}`}>
													{domain.status}
												</span>
												<p className="text-sm text-gray-500 mt-1">
													{domain.compliance}% compliant
												</p>
											</div>
										</div>

										<div className="mb-3">
											<div className="flex justify-between text-sm text-gray-600 mb-1">
												<span>Compliance Score</span>
												<span>{domain.compliance}%</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className={`h-2 rounded-full ${
														domain.compliance >= 80
															? "bg-green-500"
															: domain.compliance >= 60
															? "bg-yellow-500"
															: "bg-red-500"
													}`}
													style={{ width: `${domain.compliance}%` }}></div>
											</div>
										</div>

										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-500">
												Last check: {domain.lastCheck}
											</span>
											<Link
												to={`/dashboard/domains/${domain.id}`}
												className="text-primary-600 hover:text-primary-700 font-medium">
												View Details →
											</Link>
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>

					{/* DMARC Policy Distribution Chart - 1/3 width */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="lg:col-span-1">
						<div className="card h-full">
							<h2 className="text-xl font-bold text-gray-900 mb-4">
								DMARC Policy Distribution
							</h2>
							<div className="h-64">
								<Doughnut data={doughnutData} options={doughnutOptions} />
							</div>
							<div className="mt-4 text-sm text-gray-600">
								<p className="mb-2">
									Policy breakdown across {domains.length} domains:
								</p>
								<div className="space-y-1">
									<div className="flex justify-between">
										<span className="flex items-center">
											<div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
											Reject (Secure)
										</span>
										<span>{policyDistribution.reject}</span>
									</div>
									<div className="flex justify-between">
										<span className="flex items-center">
											<div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
											Quarantine
										</span>
										<span>{policyDistribution.quarantine}</span>
									</div>
									<div className="flex justify-between">
										<span className="flex items-center">
											<div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
											None (Monitor)
										</span>
										<span>{policyDistribution.none}</span>
									</div>
									<div className="flex justify-between">
										<span className="flex items-center">
											<div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
											No Record
										</span>
										<span>{policyDistribution["no record"]}</span>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Second Row: Quick Actions + Recent Activity + Need Help */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{/* Quick Actions */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="order-1">
						<div className="card h-full">
							<h2 className="text-xl font-bold text-gray-900 mb-4">
								Quick Actions
							</h2>
							<div className="space-y-3">
								<button
									onClick={() => setShowAddDomain(true)}
									className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
									<div className="flex items-center">
										<Plus className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
										<div>
											<p className="font-medium text-gray-900">
												Add New Domain
											</p>
											<p className="text-sm text-gray-500">
												Protect another domain
											</p>
										</div>
									</div>
								</button>
								<Link
									to="/dashboard/reports"
									className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group block">
									<div className="flex items-center">
										<BarChart3 className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
										<div>
											<p className="font-medium text-gray-900">View Reports</p>
											<p className="text-sm text-gray-500">
												Detailed analytics
											</p>
										</div>
									</div>
								</Link>
								<Link
									to="/dashboard/settings"
									className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group block">
									<div className="flex items-center">
										<Settings className="w-5 h-5 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
										<div>
											<p className="font-medium text-gray-900">
												Account Settings
											</p>
											<p className="text-sm text-gray-500">
												Manage your account
											</p>
										</div>
									</div>
								</Link>
							</div>
						</div>
					</motion.div>

					{/* Recent Activity */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="order-2">
						<div className="card h-full">
							<h2 className="text-xl font-bold text-gray-900 mb-4">
								Recent Activity
							</h2>
							<RecentActivity logs={recentActivity} />
						</div>
					</motion.div>

					{/* Need Help Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="order-3">
						<div className="card h-full flex flex-col">
							<div className="flex items-center mb-4">
								<Mail className="w-6 h-6 text-primary-600 mr-3" />
								<h2 className="text-xl font-bold text-gray-900">Need Help?</h2>
							</div>
							
							<div className="flex-grow">
								<p className="text-gray-600 mb-6 leading-relaxed">
									If you need support or have any questions, feel free to reach out to our team.
								</p>
								
								<div className="mb-6">
									<div className="flex items-center text-gray-700 mb-2">
										<Mail className="w-4 h-4 text-primary-600 mr-2" />
										<span className="font-medium">Support Email:</span>
									</div>
									<a 
										href="mailto:support@safedmarc.com"
										className="text-primary-600 hover:text-primary-700 font-medium"
									>
										support@safedmarc.com
									</a>
								</div>
							</div>
							
							<div className="mt-auto">
								<Link
									to="/contact"
									className="btn-primary w-full text-center"
								>
									Contact Support
								</Link>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Add Domain Modal */}
			{showAddDomain && (
				<AddDomainModal
					onClose={() => setShowAddDomain(false)}
					onAdd={handleAddDomain}
				/>
			)}
		</motion.div>
	);
};

export default Dashboard;
