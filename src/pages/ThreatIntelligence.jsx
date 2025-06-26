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

const ThreatIntelligence = () => {
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");
	const [threatFilter, setThreatFilter] = useState("all");
	const [timeRange, setTimeRange] = useState("24h");

	useEffect(() => {
		loadThreatData();
	}, [activeTab, threatFilter, timeRange]);

	const loadThreatData = async () => {
		setLoading(true);

		try {
			const isDev = import.meta.env.MODE === "development";

			if (isDev) {
				// Simulate API call in dev mode
				setTimeout(() => {
					setLoading(false);
				}, 1000);
				return;
			}

			// In production, you would make actual API calls here
			console.log("Loading threat intelligence from API...");

			// TODO: Replace with actual API calls when backend endpoints are ready
			// const threatData = await threatAPI.getThreatIntelligence({ activeTab, threatFilter, timeRange })

			setTimeout(() => {
				setLoading(false);
			}, 1000);
		} catch (error) {
			console.error("Error loading threat data:", error);
			setLoading(false);
		}
	};

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
		{
			id: 4,
			type: "BEC Attempt",
			severity: "critical",
			source: "192.0.2.146",
			target: "example.com",
			timestamp: "2024-01-15T13:20:00Z",
			status: "investigating",
			description: "Business Email Compromise targeting finance department",
			country: "Nigeria",
			attackVector: "Social Engineering",
		},
	];

	const threatTrends = [
		{ type: "Phishing", count: 456, trend: "up", change: "+23%" },
		{ type: "Spoofing", count: 234, trend: "down", change: "-12%" },
		{ type: "Malware", count: 123, trend: "up", change: "+8%" },
		{ type: "BEC", count: 89, trend: "stable", change: "0%" },
		{ type: "Spam", count: 567, trend: "down", change: "-5%" },
	];

	const topAttackers = [
		{ ip: "185.220.101.42", country: "Russia", attacks: 45, blocked: 43 },
		{ ip: "203.0.113.15", country: "China", attacks: 38, blocked: 35 },
		{ ip: "198.51.100.23", country: "North Korea", attacks: 29, blocked: 29 },
		{ ip: "192.0.2.146", country: "Nigeria", attacks: 24, blocked: 22 },
		{ ip: "172.16.254.1", country: "Iran", attacks: 19, blocked: 18 },
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
			<div className="container-custom py-8">
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

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Recent Threats */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="lg:col-span-2">
						<div className="card">
							<h2 className="text-xl font-bold text-gray-900 mb-6">
								Recent Threats
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

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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

										<div className="mt-3 pt-3 border-t border-gray-100">
											<div className="flex items-center justify-between">
												<span className="text-sm text-gray-600">
													Attack Vector:{" "}
													<span className="font-medium">
														{threat.attackVector}
													</span>
												</span>
												<button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
													View Details →
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>

					{/* Sidebar */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="space-y-6">
						{/* Threat Trends */}
						<div className="card">
							<h2 className="text-xl font-bold text-gray-900 mb-4">
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
						</div>

						{/* Top Attackers */}
						<div className="card">
							<h2 className="text-xl font-bold text-gray-900 mb-4">
								Top Attackers
							</h2>
							<div className="space-y-3">
								{topAttackers.map((attacker, index) => (
									<div key={attacker.ip} className="p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center justify-between mb-2">
											<div className="font-medium text-gray-900">
												{attacker.ip}
											</div>
											<span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
												#{index + 1}
											</span>
										</div>
										<div className="text-sm text-gray-600 mb-2 flex items-center">
											<MapPin className="w-3 h-3 mr-1" />
											{attacker.country}
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-500">
												Attacks: {attacker.attacks}
											</span>
											<span className="text-green-600">
												Blocked: {attacker.blocked}
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-1 mt-2">
											<div
												className="bg-green-500 h-1 rounded-full"
												style={{
													width: `${
														(attacker.blocked / attacker.attacks) * 100
													}%`,
												}}></div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Quick Actions */}
						<div className="card">
							<h2 className="text-xl font-bold text-gray-900 mb-4">
								Quick Actions
							</h2>
							<div className="space-y-3">
								<button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
									<div className="flex items-center">
										<Shield className="w-5 h-5 text-primary-600 mr-3" />
										<div>
											<p className="font-medium text-gray-900">
												Block IP Range
											</p>
											<p className="text-sm text-gray-500">
												Add suspicious IPs to blocklist
											</p>
										</div>
									</div>
								</button>
								<button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
									<div className="flex items-center">
										<AlertTriangle className="w-5 h-5 text-primary-600 mr-3" />
										<div>
											<p className="font-medium text-gray-900">
												Create Alert Rule
											</p>
											<p className="text-sm text-gray-500">
												Set up custom threat alerts
											</p>
										</div>
									</div>
								</button>
								<button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
									<div className="flex items-center">
										<Eye className="w-5 h-5 text-primary-600 mr-3" />
										<div>
											<p className="font-medium text-gray-900">Threat Hunt</p>
											<p className="text-sm text-gray-500">
												Proactive threat hunting
											</p>
										</div>
									</div>
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default ThreatIntelligence;
