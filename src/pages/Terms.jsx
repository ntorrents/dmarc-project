import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const Terms = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="min-h-screen bg-gray-50 pt-3">
			<div className="container-custom py-12">
				{/* Header
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12">
					<Link
						to="/"
						className="inline-flex items-center space-x-2 mb-8 text-primary-600 hover:text-primary-700">
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Home</span>
					</Link>
					<div className="flex items-center justify-center space-x-2 mb-6">
						<div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg">
							<Shield className="w-7 h-7 text-white" />
						</div>
						<span className="text-2xl font-bold text-gray-900">
							Safe<span className="text-primary-500">DMARC</span>
						</span>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Terms of Service
					</h1>
					<p className="text-xl text-gray-600">
						Last updated: January 15, 2025
					</p>
				</motion.div> */}

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12">
					<div className="flex justify-center space-x-12 mb-10">
						<Link
							to="/"
							className="inline-flex items-center space-x-2 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-md px-4 py-2 transition">
							<ArrowLeft className="w-4 h-4" />
							<span>Back to Home</span>
						</Link>
						<Link
							to="/signup"
							className="inline-flex items-center space-x-2 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-md px-4 py-2 transition">
							<span>Go to Free Trial</span>
							<ArrowLeft className="w-4 h-4 transform rotate-180" />
						</Link>
					</div>

					<div className="flex items-center justify-center space-x-2 mb-6">
						<div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg">
							<Shield className="w-7 h-7 text-white" />
						</div>
						<span className="text-2xl font-bold text-gray-900">
							Safe<span className="text-primary-500">DMARC</span>
						</span>
					</div>

					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Terms of Service
					</h1>
					<p className="text-xl text-gray-600">
						Last updated: January 15, 2025
					</p>
				</motion.div>

				{/* Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="max-w-4xl mx-auto">
					<div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
						<div className="prose prose-lg max-w-none">
							<h2>1. Acceptance of Terms</h2>
							<p>
								By accessing and using SafeDMARC's services, you accept and
								agree to be bound by the terms and provision of this agreement.
								If you do not agree to abide by the above, please do not use
								this service.
							</p>

							<h2>2. Description of Service</h2>
							<p>
								SafeDMARC provides email authentication and security services,
								including but not limited to:
							</p>
							<ul>
								<li>
									DMARC (Domain-based Message Authentication, Reporting &
									Conformance) implementation and monitoring
								</li>
								<li>
									SPF (Sender Policy Framework) configuration and management
								</li>
								<li>DKIM (DomainKeys Identified Mail) setup and monitoring</li>
								<li>Email security analytics and reporting</li>
								<li>Threat intelligence and protection services</li>
							</ul>

							<h2>3. User Accounts and Registration</h2>
							<p>
								To access certain features of our service, you must register for
								an account. You agree to:
							</p>
							<ul>
								<li>
									Provide accurate, current, and complete information during
									registration
								</li>
								<li>Maintain and promptly update your account information</li>
								<li>Maintain the security of your password and account</li>
								<li>
									Accept responsibility for all activities under your account
								</li>
								<li>
									Notify us immediately of any unauthorized use of your account
								</li>
							</ul>

							<h2>4. Acceptable Use Policy</h2>
							<p>You agree not to use the service to:</p>
							<ul>
								<li>Violate any applicable laws or regulations</li>
								<li>Infringe upon the rights of others</li>
								<li>Distribute spam, malware, or other harmful content</li>
								<li>Attempt to gain unauthorized access to our systems</li>
								<li>Interfere with or disrupt the service or servers</li>
								<li>Use the service for any illegal or unauthorized purpose</li>
							</ul>

							<h2>5. Service Availability</h2>
							<p>
								We strive to maintain 99.9% uptime for our services. However, we
								do not guarantee uninterrupted access and may experience
								downtime for maintenance, updates, or due to factors beyond our
								control.
							</p>

							<h2>6. Data and Privacy</h2>
							<p>
								Your privacy is important to us. Our collection and use of
								personal information is governed by our Privacy Policy, which is
								incorporated into these Terms by reference. By using our
								service, you consent to the collection and use of your
								information as outlined in our Privacy Policy.
							</p>

							<h2>7. Intellectual Property</h2>
							<p>
								The service and its original content, features, and
								functionality are and will remain the exclusive property of
								SafeDMARC and its licensors. The service is protected by
								copyright, trademark, and other laws.
							</p>

							<h2>8. Payment Terms</h2>
							<p>For paid services:</p>
							<ul>
								<li>
									Fees are charged in advance on a monthly or annual basis
								</li>
								<li>All fees are non-refundable except as required by law</li>
								<li>
									We offer a 30-day money-back guarantee for new customers
								</li>
								<li>Prices may change with 30 days' notice</li>
								<li>
									Failure to pay may result in service suspension or termination
								</li>
							</ul>

							<h2>9. Termination</h2>
							<p>
								We may terminate or suspend your account and access to the
								service immediately, without prior notice or liability, for any
								reason, including breach of these Terms. Upon termination, your
								right to use the service will cease immediately.
							</p>

							<h2>10. Limitation of Liability</h2>
							<p>
								In no event shall SafeDMARC, its directors, employees, partners,
								agents, suppliers, or affiliates be liable for any indirect,
								incidental, special, consequential, or punitive damages,
								including without limitation, loss of profits, data, use,
								goodwill, or other intangible losses.
							</p>

							<h2>11. Disclaimer</h2>
							<p>
								The information on this service is provided on an "as is" basis.
								To the fullest extent permitted by law, SafeDMARC excludes all
								representations, warranties, conditions, and terms whether
								express or implied.
							</p>

							<h2>12. Governing Law</h2>
							<p>
								These Terms shall be interpreted and governed by the laws of the
								United States, without regard to its conflict of law provisions.
								Any disputes arising from these Terms will be resolved in the
								courts of the United States.
							</p>

							<h2>13. Changes to Terms</h2>
							<p>
								We reserve the right to modify or replace these Terms at any
								time. If a revision is material, we will provide at least 30
								days' notice prior to any new terms taking effect.
							</p>

							<h2>14. Contact Information</h2>
							<p>
								If you have any questions about these Terms of Service, please
								contact us at:
							</p>
							<ul>
								<li>Email: legal@safedmarc.com</li>
								<li>Phone: +1 (555) 123-4567</li>
								<li>Address: 123 Secure Street, Cyber City, CC 12345</li>
							</ul>

							<div className="mt-12 p-6 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-600 mb-0">
									<strong>Note:</strong> This is a draft version of our Terms of
									Service. The actual terms may vary and should be reviewed by
									legal counsel before implementation. This document is provided
									for demonstration purposes only.
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default Terms;
