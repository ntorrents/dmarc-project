import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	AlertTriangle,
	Shield,
	Eye,
	Clock,
	Search,
	Filter,
	RefreshCw,
	TrendingUp,
	TrendingDown,
	Zap,
	Target,
	Activity,
	MapPin,
	Calendar,
} from "lucide-react";
import { useNotification } from "../context/NotificationContext";

const ThreatIntelligence = () => {
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");
	const [threatFilter, setThreatFilter] = useState("all");
	const [timeRange, setTimeRange] = useState("24h");
	const [error, setError] = useState(null);
	const { error: showError } = useNotification();

	useEffect(() => {
		loadThreatData();
	}, [activeTab, threatFilter, timeRange]);

	const loadThreatData = async () => {
		setLoading(true);
		setError(null);

		try {
			console.log("Loading threat intelligence from API...");
			
			// TODO: Implement actual API calls when backend endpoints are ready
			// For now, we'll simulate loading and show a coming soon message
			
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		} catch (error) {
			console.error("Error loading threat data:", error);
			setError("Failed to load threat intelligence. Please try again.");
			showError("Failed to load threat data", error.message);
			setLoading(false);
		}
	};

	// Mock data for demonstration
	const threatOverview = {
		activeThreatsCurrent: 23,
		activeThreatsChange: "+5",
		blockedAttacks: 1847,
		blockedAttacksChange: "+12%",
		riskLevel: "Medium",
		riskScore: 67,
		lastUpdate: "2 minutes ago",
	};

	const recentThreats = [
		{
			id: 1,
			type: "Phishing Campaign",
			severity: "high",
			source: "185.220.101.42",
			target: "example.com",
			timestamp: "2024-01-15T14:30:00Z",
			status: "blocked",
			description: "Sophisticated phishing attempt targeting executive emails",
			country: "Russia",
			attackVector: "Email Spoofing",
		},
		{
			id: 2,
			type: "Domain Spoofing",
			severity: "medium",
			source: "203.0.113.15",
			target: "mycompany.org",
			timestamp: "2024-01-15T14:15:00Z",
			status: "monitoring",
			description: "Suspicious domain registration mimicking company domain",
			country: "China",
			attackVector: "DNS Manipulation",
		},
		{
			id: 3,
			type: "Malware Distribution",
			severity: "high",
			source: "198.51.100.23",
			target: "business.net",
			timestamp: "2024-01-15T13:45:00Z",
			status: "blocked",
			description: "Malicious attachment detected in email campaign",
			country: "North Korea",
			attackVector: "Email Attachment",
		},
	];

	const threatTrends = [
		{ type: "Phishing", count: 456, trend: "up", change: "+23%" },
		{ type: "Spoofing", count: 234, trend: "down", change: "-12%" },
		{ type: "Malware", count: 123, trend: "up", change: "+8%" },
		{ type: "BEC", count: 89, trend: "stable", change: "0%" },
		{ type: "Spam", count: 567, trend: "down", change: "-5%" },
	];

	const getSeverityColor = (severity) => {
		switch (severity) {
			case "critical":
				return "text-red-600 bg-red-100";
			case "high":
				return "text-orange-600 bg-orange-100";
			case "medium":
				return "text-yellow-600 bg-yellow-100";
			case "low":
				return "text-green-600 bg-green-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "blocked":
				return "text-green-600 bg-green-100";
			case "monitoring":
				return "text-blue-600 bg-blue-100";
			case "investigating":
				return "text-yellow-600 bg-yellow-100";
			case "active":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const formatTimeAgo = (timestamp) => {
		const now = new Date();
		const time = new Date(timestamp);
		const diffInMinutes = Math.floor((now - time) / (1000 * 60));

		if (diffInMinutes < 60) {
			return `${diffInMinutes}m ago`;
		} else if (diffInMinutes < 1440) {
			return `${Math.floor(diffInMinutes / 60)}h ago`;
		} else {
			return `${Math.floor(diffInMinutes / 1440)}d ago`;
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading threat intelligence...</p>
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
			className="min-h-screen bg-gray-50 pt-20">
			<div className="container-custom py-6">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Threat Intelligence
							</h1>
							<p className="text-gray-600 mt-1">
								Real-time security monitoring and threat analysis
							</p>
						</div>
						<div className="flex space-x-3">
							<button onClick={loadThreatData} className="btn-outline">
								<RefreshCw className="w-4 h-4 mr-2" />
								Refresh
							</button>
							<button className="btn-primary">
								<Eye className="w-4 h-4 mr-2" />
								Live Monitor
							</button>
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
							onClick={loadThreatData}
							className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
							Try again
						</button>
					</motion.div>
				)}

				{/* Threat Overview */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="card">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">
								Active Threats
							</h3>
							<AlertTriangle className="w-5 h-5 text-red-600" />
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{threatOverview.activeThreatsCurrent}
						</div>
						<div className="text-sm text-red-600 flex items-center mt-1">
							<TrendingUp className="w-4 h-4 mr-1" />
							{threatOverview.activeThreatsChange} from last hour
						</div>
					</div>

					<div className="card">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">
								Blocked Attacks
							</h3>
							<Shield className="w-5 h-5 text-green-600" />
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{threatOverview.blockedAttacks.toLocaleString()}
						</div>
						<div className="text-sm text-green-600 flex items-center mt-1">
							<TrendingUp className="w-4 h-4 mr-1" />
							{threatOverview.blockedAttacksChange} today
						</div>
					</div>

					<div className="card">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">Risk Level</h3>
							<Target className="w-5 h-5 text-yellow-600" />
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{threatOverview.riskLevel}
						</div>
						<div className="text-sm text-gray-600 flex items-center mt-1">
							<Activity className="w-4 h-4 mr-1" />
							Score: {threatOverview.riskScore}/100
						</div>
					</div>

					<div className="card">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">Last Update</h3>
							<Clock className="w-5 h-5 text-blue-600" />
						</div>
						<div className="text-2xl font-bold text-gray-900">Live</div>
						<div className="text-sm text-blue-600 flex items-center mt-1">
							<Zap className="w-4 h-4 mr-1" />
							{threatOverview.lastUpdate}
						</div>
					</div>
				</motion.div>

				{/* Filters */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="card mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center">
							<Filter className="w-5 h-5 mr-2" />
							Threat Filters
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Threat Type
							</label>
							<select
								value={threatFilter}
								onChange={(e) => setThreatFilter(e.target.value)}
								className="input-field">
								<option value="all">All Threats</option>
								<option value="phishing">Phishing</option>
								<option value="spoofing">Spoofing</option>
								<option value="malware">Malware</option>
								<option value="bec">Business Email Compromise</option>
								<option value="spam">Spam</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Time Range
							</label>
							<select
								value={timeRange}
								onChange={(e) => setTimeRange(e.target.value)}
								className="input-field">
								<option value="1h">Last Hour</option>
								<option value="24h">Last 24 Hours</option>
								<option value="7d">Last 7 Days</option>
								<option value="30d">Last 30 Days</option>
							</select>
						</div>

						<div className="flex items-end">
							<button className="btn-primary w-full">
								<Search className="w-4 h-4 mr-2" />
								Apply Filters
							</button>
						</div>
					</div>
				</motion.div>

				{/* Coming Soon Notice */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="card mb-8">
					<div className="text-center py-12">
						<Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Advanced Threat Intelligence Coming Soon
						</h3>
						<p className="text-gray-600 mb-6">
							We're developing comprehensive threat intelligence features that will provide real-time monitoring and analysis of email security threats.
						</p>
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
							<p className="text-blue-800 text-sm">
								<strong>What's coming:</strong> Real-time threat detection, IP reputation analysis, attack pattern recognition, and automated response capabilities.
							</p>
						</div>
					</div>
				</motion.div>

				{/* Sample Threat Data */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Recent Threats */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-6">
							Sample Threat Data
						</h2>
						<div className="space-y-4">
							{recentThreats.map((threat) => (
								<div
									key={threat.id}
									className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center space-x-3">
											<AlertTriangle className="w-5 h-5 text-red-500" />
											<div>
												<h3 className="font-semibold text-gray-900">
													{threat.type}
												</h3>
												<p className="text-sm text-gray-600">
													{threat.description}
												</p>
											</div>
										</div>
										<div className="flex space-x-2">
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
													threat.severity
												)}`}>
												{threat.severity}
											</span>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
													threat.status
												)}`}>
												{threat.status}
											</span>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-gray-500">Source:</span>
											<div className="font-medium">{threat.source}</div>
										</div>
										<div>
											<span className="text-gray-500">Target:</span>
											<div className="font-medium">{threat.target}</div>
										</div>
										<div>
											<span className="text-gray-500">Country:</span>
											<div className="font-medium flex items-center">
												<MapPin className="w-3 h-3 mr-1" />
												{threat.country}
											</div>
										</div>
										<div>
											<span className="text-gray-500">Time:</span>
											<div className="font-medium flex items-center">
												<Calendar className="w-3 h-3 mr-1" />
												{formatTimeAgo(threat.timestamp)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</motion.div>

					{/* Threat Trends */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-6">
							Threat Trends
						</h2>
						<div className="space-y-3">
							{threatTrends.map((trend) => (
								<div
									key={trend.type}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div>
										<div className="font-medium text-gray-900">
											{trend.type}
										</div>
										<div className="text-sm text-gray-500">
											{trend.count} incidents
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<span
											className={`text-sm font-medium ${
												trend.trend === "up"
													? "text-red-600"
													: trend.trend === "down"
													? "text-green-600"
													: "text-gray-600"
											}`}>
											{trend.change}
										</span>
										{trend.trend === "up" && (
											<TrendingUp className="w-4 h-4 text-red-500" />
										)}
										{trend.trend === "down" && (
											<TrendingDown className="w-4 h-4 text-green-500" />
										)}
										{trend.trend === "stable" && (
											<div className="w-4 h-4 bg-gray-400 rounded-full" />
										)}
									</div>
								</div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default ThreatIntelligence;