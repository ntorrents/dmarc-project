import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Tag, FileText } from "lucide-react";
import { validateDomain, sanitizeInput } from "../../lib/helpers";
import PropTypes from "prop-types";

const AddDomainModal = ({ onClose, onAdd }) => {
	const [formData, setFormData] = useState({
		name: "",
		tag: "",
		description: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: sanitizeInput(value),
		}));

		// Clear error when user starts typing
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!formData.name.trim()) {
			setError("Domain name is required");
			return;
		}

		if (!validateDomain(formData.name)) {
			setError("Please enter a valid domain name (e.g., example.com)");
			return;
		}

		try {
			setLoading(true);
			await onAdd(formData);
		} catch (err) {
			setError(err.message || "Failed to add domain");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 overflow-y-auto">
				<div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					{/* Background overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-gray-900">
								Add New Domain
							</h3>
							<button
								onClick={onClose}
								className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Domain Name */}
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700 mb-2">
									Domain Name *
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Globe className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className="input-field pl-10"
										placeholder="example.com"
										required
									/>
								</div>
							</div>

							{/* Tag */}
							<div>
								<label
									htmlFor="tag"
									className="block text-sm font-medium text-gray-700 mb-2">
									Tag (Optional)
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Tag className="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										id="tag"
										name="tag"
										value={formData.tag}
										onChange={handleChange}
										className="input-field pl-10"
										placeholder="production, staging, etc."
									/>
								</div>
							</div>

							{/* Description */}
							<div>
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700 mb-2">
									Description (Optional)
								</label>
								<div className="relative">
									<div className="absolute top-3 left-3 pointer-events-none">
										<FileText className="h-5 w-5 text-gray-400" />
									</div>
									<textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleChange}
										rows={3}
										className="input-field pl-10 resize-none"
										placeholder="Brief description of this domain..."
									/>
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

							{/* Buttons */}
							<div className="flex space-x-3 pt-4">
								<button
									type="button"
									onClick={onClose}
									className="flex-1 btn-outline"
									disabled={loading}>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 btn-primary"
									disabled={loading}>
									{loading ? (
										<div className="flex items-center justify-center">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Adding...
										</div>
									) : (
										"Add Domain"
									)}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			</div>
		</AnimatePresence>
	);
};
AddDomainModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onAdd: PropTypes.func.isRequired,
};

export default AddDomainModal;
