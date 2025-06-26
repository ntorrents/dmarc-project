import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Download,
	Calendar,
	Filter,
	TrendingUp,
	Mail,
	Shield,
	AlertTriangle,
	CheckCircle,
	Clock,
} from "lucide-react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

const Reports = () => {
	const [loading, setLoading] = useState(true);
	const [dateRange, setDateRange] = useState("30");
	const [reportType, setReportType] = useState("overview");
	const [selectedDomains, setSelectedDomains] = useState(["all"]);

	useEffect(() => {
		loadReports();
	}, [dateRange, reportType, selectedDomains]);

	const loadReports = async () => {
		setLoading(true);

		try {
			console.log("Loading reports from API...");
			
			// TODO: Implement actual API calls when backend endpoints are ready
			// For now, we'll show a message that this feature is coming soon
			
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		} catch (error) {
			console.error("Error loading reports:", error);
			setLoading(false);
		}
	};

	// Mock data for charts
	const emailVolumeData = {
		labels: ["Jan 1", "Jan 8", "Jan 15", "Jan 22", "Jan 29", "Feb 5", "Feb 12"],
		datasets: [
			{
				label: "Total Emails",
				data: [1200, 1350, 1100, 1400, 1250, 1600, 1450],
				borderColor: "rgb(34, 197, 94)",
				backgroundColor: "rgba(34, 197, 94, 0.1)",
				tension: 0.4,
			},
			{
				label: "Blocked Emails",
				data: [180, 203, 165, 210, 188, 240, 218],
				borderColor: "rgb(239, 68, 68)",
				backgroundColor: "rgba(239, 68, 68, 0.1)",
				tension: 0.4,
			},
		],
	};

	const complianceData = {
		labels: ["DMARC Pass", "SPF Pass", "DKIM Pass", "All Pass", "Failed"],
		datasets: [
			{
				data: [85, 92, 88, 78, 15],
				backgroundColor: [
					"#10b981",
					"#3b82f6",
					"#8b5cf6",
					"#06b6d4",
					"#ef4444",
				],
				borderWidth: 2,
			},
		],
	};

	const threatTypesData = {
		labels: ["Phishing", "Spoofing", "Malware", "Spam", "Other"],
		datasets: [
			{
				label: "Threats Blocked",
				data: [45, 38, 12, 67, 23],
				backgroundColor: [
					"rgba(239, 68, 68, 0.8)",
					"rgba(245, 158, 11, 0.8)",
					"rgba(139, 92, 246, 0.8)",
					"rgba(59, 130, 246, 0.8)",
					"rgba(107, 114, 128, 0.8)",
				],
				borderColor: [
					"rgb(239, 68, 68)",
					"rgb(245, 158, 11)",
					"rgb(139, 92, 246)",
					"rgb(59, 130, 246)",
					"rgb(107, 114, 128)",
				],
				borderWidth: 1,
			},
		],
	};

	const reportSummary = {
		totalEmails: 45678,
		blockedEmails: 6834,
		passRate: 85.2,
		topThreats: [
			{ type: "Phishing", count: 2341, trend: "up" },
			{ type: "Spoofing", count: 1876, trend: "down" },
			{ type: "Spam", count: 1654, trend: "up" },
			{ type: "Malware", count: 963, trend: "stable" },
		],
		domainHealth: [
			{ domain: "example.com", status: "excellent", score: 98 },
			{ domain: "mycompany.org", status: "good", score: 87 },
			{ domain: "business.net", status: "needs-attention", score: 64 },
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
			},
		},
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading reports...</p>
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
								Reports & Analytics
							</h1>
							<p className="text-gray-600 mt-1">
								Comprehensive email security insights and reporting
							</p>
						</div>
						<div className="flex space-x-3">
							<button className="btn-outline">
								<Download className="w-4 h-4 mr-2" />
								Export Report
							</button>
							<button className="btn-primary">
								<Calendar className="w-4 h-4 mr-2" />
								Schedule Report
							</button>
						</div>
					</div>
				</motion.div>

				{/* Filters */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="card mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center">
							<Filter className="w-5 h-5 mr-2" />
							Report Filters
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Date Range
							</label>
							<select
								value={dateRange}
								onChange={(e) => setDateRange(e.target.value)}
								className="input-field">
								<option value="7">Last 7 days</option>
								<option value="30">Last 30 days</option>
								<option value="90">Last 90 days</option>
								<option value="365">Last year</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Report Type
							</label>
							<select
								value={reportType}
								onChange={(e) => setReportType(e.target.value)}
								className="input-field">
								<option value="overview">Overview</option>
								<option value="compliance">Compliance</option>
								<option value="threats">Threat Analysis</option>
								<option value="domains">Domain Performance</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Domains
							</label>
							<select
								value={selectedDomains[0]}
								onChange={(e) => setSelectedDomains([e.target.value])}
								className="input-field">
								<option value="all">All Domains</option>
								<option value="example.com">example.com</option>
								<option value="mycompany.org">mycompany.org</option>
								<option value="business.net">business.net</option>
							</select>
						</div>

						<div className="flex items-end">
							<button onClick={loadReports} className="btn-primary w-full">
								Generate Report
							</button>
						</div>
					</div>
				</motion.div>

				{/* Summary Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="card">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">
								Total Emails
							</h3>
							<Mail className="w-5 h-5 text-blue-600" />
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{reportSummary.totalEmails.toLocaleString()}
						</div>
						<div className="text-sm text-green-600 flex items-center mt-1">
							<TrendingUp className="w-4 h-4 mr-1" />
							+12% from last period
						</div>
					</div>

					<div className="card">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">
								Blocked Emails
							</h3>
							<Shield className="w-5 h-5 text-red-600" />
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{reportSummary.blockedEmails.toLocaleString()}
						</div>
						<div className="text-sm text-red-600 flex items-center mt-1">
							<TrendingUp className="w-4 h-4 mr-1" />
							+8% from last period
						</div>
					</div>

					<div className="card">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">Pass Rate</h3>
							<CheckCircle className="w-5 h-5 text-green-600" />
						</div>
						<div className="text-2xl font-bold text-gray-900">
							{reportSummary.passRate}%
						</div>
						<div className="text-sm text-green-600 flex items-center mt-1">
							<TrendingUp className="w-4 h-4 mr-1" />
							+2.3% from last period
						</div>
					</div>

					<div className="card">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium text-gray-600">
								Active Threats
							</h3>
							<AlertTriangle className="w-5 h-5 text-yellow-600" />
						</div>
						<div className="text-2xl font-bold text-gray-900">23</div>
						<div className="text-sm text-yellow-600 flex items-center mt-1">
							<Clock className="w-4 h-4 mr-1" />
							Monitoring
						</div>
					</div>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Email Volume Chart */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Email Volume Trends
						</h2>
						<div className="h-80">
							<Line data={emailVolumeData} options={chartOptions} />
						</div>
					</motion.div>

					{/* Compliance Overview */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Authentication Compliance
						</h2>
						<div className="h-80">
							<Doughnut data={complianceData} options={doughnutOptions} />
						</div>
					</motion.div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Threat Types */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Threat Types
						</h2>
						<div className="h-64">
							<Bar data={threatTypesData} options={chartOptions} />
						</div>
					</motion.div>

					{/* Top Threats */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Top Threats
						</h2>
						<div className="space-y-4">
							{reportSummary.topThreats.map((threat) => (
								<div
									key={threat.type}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div>
										<div className="font-medium text-gray-900">
											{threat.type}
										</div>
										<div className="text-sm text-gray-500">
											{threat.count.toLocaleString()} incidents
										</div>
									</div>
									<div className="flex items-center">
										{threat.trend === "up" && (
											<TrendingUp className="w-4 h-4 text-red-500" />
										)}
										{threat.trend === "down" && (
											<TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
										)}
										{threat.trend === "stable" && (
											<div className="w-4 h-4 bg-gray-400 rounded-full" />
										)}
									</div>
								</div>
							))}
						</div>
					</motion.div>

					{/* Domain Health */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.7 }}
						className="card">
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Domain Health
						</h2>
						<div className="space-y-4">
							{reportSummary.domainHealth.map((domain) => (
								<div key={domain.domain} className="p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<div className="font-medium text-gray-900">
											{domain.domain}
										</div>
										<div className="text-sm font-medium">
											{domain.score}/100
										</div>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`h-2 rounded-full ${
												domain.status === "excellent"
													? "bg-green-500"
													: domain.status === "good"
													? "bg-yellow-500"
													: "bg-red-500"
											}`}
											style={{ width: `${domain.score}%` }}></div>
									</div>
									<div className="text-xs text-gray-500 mt-1 capitalize">
										{domain.status.replace("-", " ")}
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

export default Reports;
