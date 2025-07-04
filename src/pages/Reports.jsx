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
	BarChart3,
} from "lucide-react";
import { useNotification } from "../context/NotificationContext";

const Reports = () => {
	const [loading, setLoading] = useState(true);
	const [dateRange, setDateRange] = useState("30");
	const [reportType, setReportType] = useState("overview");
	const [selectedDomains, setSelectedDomains] = useState(["all"]);
	const [error, setError] = useState(null);
	const { error: showError } = useNotification();

	useEffect(() => {
		loadReports();
	}, [dateRange, reportType, selectedDomains]);

	const loadReports = async () => {
		setLoading(true);
		setError(null);

		try {
			console.log("Loading reports from API...");
			
			// TODO: Implement actual API calls when backend endpoints are ready
			// For now, we'll simulate loading and show a coming soon message
			
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		} catch (error) {
			console.error("Error loading reports:", error);
			setError("Failed to load reports. Please try again.");
			showError("Failed to load reports", error.message);
			setLoading(false);
		}
	};

	// Mock data for demonstration
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
	};

	const recentActivity = [
		{
			type: "success",
			message: "DMARC policy updated to quarantine",
			domain: "example.com",
			time: "2 hours ago",
		},
		{
			type: "warning",
			message: "SPF record alignment issue detected",
			domain: "mycompany.org",
			time: "1 day ago",
		},
		{
			type: "info",
			message: "New user added to account",
			domain: "john@example.com",
			time: "2 days ago",
		},
		{
			type: "error",
			message: "DKIM signature validation failed",
			domain: "business.net",
			time: "3 days ago",
		},
	];

	const getActivityIcon = (type) => {
		switch (type) {
			case "success":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "warning":
				return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
			case "error":
				return <AlertTriangle className="w-4 h-4 text-red-500" />;
			case "info":
				return <BarChart3 className="w-4 h-4 text-blue-500" />;
			default:
				return null;
		}
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

				{/* Error Display */}
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-800">{error}</p>
						<button
							onClick={loadReports}
							className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
							Try again
						</button>
					</motion.div>
				)}

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

				{/* Coming Soon Notice */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="card mb-8">
					<div className="text-center py-12">
						<BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Advanced Reports Coming Soon
						</h3>
						<p className="text-gray-600 mb-6">
							We're working on comprehensive reporting features that will provide detailed insights into your email security performance.
						</p>
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
							<p className="text-blue-800 text-sm">
								<strong>What's coming:</strong> Interactive charts, detailed analytics, custom report generation, and automated scheduling.
							</p>
						</div>
					</div>
				</motion.div>

				{/* Recent Activity */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="card">
					<h2 className="text-xl font-bold text-gray-900 mb-6">
						Recent Activity
					</h2>
					<div className="space-y-4">
						{recentActivity.map((activity, index) => (
							<div
								key={index}
								className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
								{getActivityIcon(activity.type)}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 truncate">
										{activity.message}
									</p>
									<p className="text-xs text-gray-500">
										{activity.domain} • {activity.time}
									</p>
								</div>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default Reports;