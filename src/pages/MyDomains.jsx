import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Search,
	Filter,
	Plus,
	Globe,
	Tag,
	Shield,
	AlertTriangle,
	CheckCircle,
	XCircle,
	BarChart3,
} from "lucide-react";
import { domainsAPI } from "../lib/api/domains";
import { getErrorMessage } from "../lib/helpers";
import AddDomainModal from "../components/modals/AddDomainModal";
import { Link } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { activityAPI } from "../lib/api/activity";
import { useAuthContext } from "../context/AuthContext";

const MyDomains = () => {
	const [domains, setDomains] = useState([]);
	const [filteredDomains, setFilteredDomains] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddDomain, setShowAddDomain] = useState(false);
	const { success, error: showError } = useNotification();
	const { user } = useAuthContext();

	// Filter states
	const [filters, setFilters] = useState({
		search: "",
		tag: "",
		compliance: "",
		tld: "",
		policy: "",
		dateFrom: "",
		dateTo: "",
	});

	const complianceOptions = [
		{ value: "", label: "All Compliance Levels" },
		{ value: "high", label: "High (80-100%)" },
		{ value: "medium", label: "Medium (50-79%)" },
		{ value: "low", label: "Low (0-49%)" },
	];

	const policyOptions = [
		{ value: "", label: "All Policies" },
		{ value: "none", label: "None" },
		{ value: "quarantine", label: "Quarantine" },
		{ value: "reject", label: "Reject" },
	];

	useEffect(() => {
		loadDomains();
	}, []);

	useEffect(() => {
		applyFilters();
	}, [domains, filters]);

	const loadDomains = async () => {
		try {
			setLoading(true);
			setError(null);

			console.log("Fetching domains from API...");
			const data = await domainsAPI.list(filters);
			console.log("Domains API response:", data);
			
			// Transform API data to match UI expectations
			const transformedDomains = Array.isArray(data) ? data.map(domain => ({
				id: domain.id,
				name: domain.nombre || domain.name,
				status: mapDomainStatus(domain.status, domain.compliance_level),
				policy: domain.dmarc_policy || 'none',
				compliance: domain.compliance_score || 0,
				lastCheck: domain.last_check || new Date().toISOString(),
				emails: domain.email_count || 0,
				tag: Array.isArray(domain.tags) ? domain.tags[0] : (domain.tag || 'untagged'),
				createdAt: domain.created_at || new Date().toISOString(),
				tld: extractTLD(domain.nombre || domain.name),
			})) : [];
			
			console.log("Transformed domains:", transformedDomains);
			setDomains(transformedDomains);
		} catch (err) {
			console.error("Error loading domains:", err);
			const errorMessage = getErrorMessage(err);
			setError(errorMessage);
			showError("Failed to load domains", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	// Helper function to map domain status
	const mapDomainStatus = (status, complianceLevel) => {
		if (status === 'active' && complianceLevel === 'high') return 'protected';
		if (status === 'active' && complianceLevel === 'medium') return 'warning';
		if (status === 'active' && complianceLevel === 'low') return 'error';
		return status || 'error';
	};

	// Helper function to extract TLD
	const extractTLD = (domain) => {
		if (!domain) return 'com';
		const parts = domain.split('.');
		return parts[parts.length - 1] || 'com';
	};

	const applyFilters = () => {
		let filtered = [...domains];

		// Search filter
		if (filters.search) {
			filtered = filtered.filter(
				(domain) =>
					domain.name.toLowerCase().includes(filters.search.toLowerCase()) ||
					domain.tag.toLowerCase().includes(filters.search.toLowerCase())
			);
		}

		// Tag filter
		if (filters.tag) {
			filtered = filtered.filter((domain) => domain.tag === filters.tag);
		}

		// Compliance filter
		if (filters.compliance) {
			filtered = filtered.filter((domain) => {
				switch (filters.compliance) {
					case "high":
						return domain.compliance >= 80;
					case "medium":
						return domain.compliance >= 50 && domain.compliance < 80;
					case "low":
						return domain.compliance < 50;
					default:
						return true;
				}
			});
		}

		// TLD filter
		if (filters.tld) {
			filtered = filtered.filter((domain) => domain.tld === filters.tld);
		}

		// Policy filter
		if (filters.policy) {
			filtered = filtered.filter((domain) => domain.policy === filters.policy);
		}

		// Date filters
		if (filters.dateFrom) {
			filtered = filtered.filter(
				(domain) => new Date(domain.createdAt) >= new Date(filters.dateFrom)
			);
		}

		if (filters.dateTo) {
			filtered = filtered.filter(
				(domain) => new Date(domain.createdAt) <= new Date(filters.dateTo)
			);
		}

		setFilteredDomains(filtered);
	};

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const clearFilters = () => {
		setFilters({
			search: "",
			tag: "",
			compliance: "",
			tld: "",
			policy: "",
			dateFrom: "",
			dateTo: "",
		});
	};

	const handleAddDomain = async (domainData) => {
		try {
			console.log("Adding domain:", domainData);
			
			// Create domain via API
			const createdDomain = await domainsAPI.create({
				nombre: domainData.name,
				description: domainData.description,
				tags: domainData.tag ? [domainData.tag] : [],
			});
			
			console.log("Domain created:", createdDomain);
			
			// Transform and add to local state
			const transformedDomain = {
				id: createdDomain.id,
				name: createdDomain.nombre || createdDomain.name,
				status: 'warning',
				policy: 'none',
				compliance: 0,
				lastCheck: new Date().toISOString(),
				emails: 0,
				tag: domainData.tag || 'new',
				createdAt: new Date().toISOString(),
				tld: extractTLD(createdDomain.nombre || createdDomain.name),
			};
			
			setDomains((prev) => [...prev, transformedDomain]);
			setShowAddDomain(false);
			success("Domain added successfully!");
			
			// Log the domain creation activity
			try {
				const userName = user?.first_name && user?.last_name 
					? `${user.first_name} ${user.last_name}` 
					: user?.username || user?.name || "User";
				
				await activityAPI.logDomainCreated(
					createdDomain.nombre || createdDomain.name,
					userName
				);
			} catch (error) {
				console.error("Failed to log domain creation activity:", error);
			}
		} catch (err) {
			console.error("Error adding domain:", err);
			const errorMessage = getErrorMessage(err);
			showError("Failed to add domain", errorMessage);
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
				return <AlertTriangle className="w-5 h-5 text-gray-500" />;
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

	const formatDate = (dateString) => {
		if (!dateString) return 'Never';
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getUniqueValues = (key) => {
		return [...new Set(domains.map((domain) => domain[key]).filter(Boolean))];
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading domains...</p>
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
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">My Domains</h1>
							<p className="text-gray-600 mt-1">
								Manage and monitor your protected domains
							</p>
						</div>
						<button
							onClick={() => setShowAddDomain(true)}
							className="btn-primary">
							<Plus className="w-4 h-4 mr-2" />
							Add Domain
						</button>
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

				{/* Filters */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="card mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center">
							<Filter className="w-5 h-5 mr-2" />
							Filters
						</h2>
						<button
							onClick={clearFilters}
							className="text-sm text-gray-600 hover:text-gray-800">
							Clear All
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Search */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Search
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="text"
									value={filters.search}
									onChange={(e) => handleFilterChange("search", e.target.value)}
									className="input-field pl-10"
									placeholder="Search domains..."
								/>
							</div>
						</div>

						{/* Tag */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Tag
							</label>
							<select
								value={filters.tag}
								onChange={(e) => handleFilterChange("tag", e.target.value)}
								className="input-field">
								<option value="">All Tags</option>
								{getUniqueValues("tag").map((tag) => (
									<option key={tag} value={tag}>
										{tag}
									</option>
								))}
							</select>
						</div>

						{/* Compliance */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Compliance Level
							</label>
							<select
								value={filters.compliance}
								onChange={(e) =>
									handleFilterChange("compliance", e.target.value)
								}
								className="input-field">
								{complianceOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						{/* TLD */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Top Level Domain
							</label>
							<select
								value={filters.tld}
								onChange={(e) => handleFilterChange("tld", e.target.value)}
								className="input-field">
								<option value="">All TLDs</option>
								{getUniqueValues("tld").map((tld) => (
									<option key={tld} value={tld}>
										.{tld}
									</option>
								))}
							</select>
						</div>
					</div>
				</motion.div>

				{/* Results Summary */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="mb-6">
					<p className="text-gray-600">
						Showing {filteredDomains.length} of {domains.length} domains
					</p>
				</motion.div>

				{/* Domains Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{filteredDomains.map((domain, index) => (
						<motion.div
							key={domain.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							className="card hover:shadow-xl transition-all duration-300">
							{/* Domain Header */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-3">
									{getStatusIcon(domain.status)}
									<div>
										<h3 className="font-semibold text-gray-900">
											{domain.name}
										</h3>
										<div className="flex items-center space-x-2 mt-1">
											{domain.tag && (
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
													<Tag className="w-3 h-3 mr-1" />
													{domain.tag}
												</span>
											)}
											<span className="text-xs text-gray-500">
												.{domain.tld}
											</span>
										</div>
									</div>
								</div>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
										domain.status
									)}`}>
									{domain.status}
								</span>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-lg font-bold text-gray-900">
										{domain.compliance}%
									</div>
									<div className="text-xs text-gray-500">Compliance</div>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-lg font-bold text-gray-900">
										{domain.emails.toLocaleString()}
									</div>
									<div className="text-xs text-gray-500">Emails</div>
								</div>
							</div>

							{/* Compliance Bar */}
							<div className="mb-4">
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

							{/* Domain Info */}
							<div className="space-y-2 text-sm text-gray-600 mb-4">
								<div className="flex items-center justify-between">
									<span>DMARC Policy:</span>
									<span className="font-medium">{domain.policy}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Created:</span>
									<span>{formatDate(domain.createdAt)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Last Check:</span>
									<span>{formatDate(domain.lastCheck)}</span>
								</div>
							</div>

							{/* Actions */}
							<div className="flex space-x-2">
								<Link
									to={`/dashboard/domains/${domain.id}`}
									className="flex-1 btn-primary text-center">
									<BarChart3 className="w-4 h-4 mr-2" />
									View Details
								</Link>
								<button className="btn-outline">
									<Shield className="w-4 h-4" />
								</button>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Empty State */}
				{filteredDomains.length === 0 && !loading && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="text-center py-12">
						<Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							{domains.length === 0
								? "No domains yet"
								: "No domains match your filters"}
						</h3>
						<p className="text-gray-600 mb-6">
							{domains.length === 0
								? "Add your first domain to start protecting your email communications."
								: "Try adjusting your filters to see more results."}
						</p>
						{domains.length === 0 && (
							<button
								onClick={() => setShowAddDomain(true)}
								className="btn-primary">
								<Plus className="w-4 h-4 mr-2" />
								Add Your First Domain
							</button>
						)}
					</motion.div>
				)}
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

export default MyDomains;