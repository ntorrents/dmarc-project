import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const Privacy = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="min-h-screen bg-gray-50 pt-3">
			<div className="container-custom py-12">
				{/* Header */}
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
							<h2>1. Introduction</h2>
							<p>
								SafeDMARC ("we," "our," or "us") is committed to protecting your
								privacy. This Privacy Policy explains how we collect, use,
								disclose, and safeguard your information when you use our email
								security services.
							</p>

							<h2>2. Information We Collect</h2>

							<h3>2.1 Personal Information</h3>
							<p>We may collect the following personal information:</p>
							<ul>
								<li>
									Name and contact information (email address, phone number)
								</li>
								<li>Company information and job title</li>
								<li>Account credentials and authentication data</li>
								<li>Billing and payment information</li>
								<li>Communication preferences</li>
							</ul>

							<h3>2.2 Technical Information</h3>
							<p>We automatically collect certain technical information:</p>
							<ul>
								<li>IP addresses and device information</li>
								<li>Browser type and version</li>
								<li>Operating system information</li>
								<li>Usage data and analytics</li>
								<li>Log files and system activity</li>
							</ul>

							<h3>2.3 Email Security Data</h3>
							<p>As part of our email security services, we collect:</p>
							<ul>
								<li>DNS records (DMARC, SPF, DKIM)</li>
								<li>Email authentication reports</li>
								<li>Domain configuration data</li>
								<li>Email traffic patterns and statistics</li>
								<li>Threat intelligence data</li>
							</ul>

							<h2>3. How We Use Your Information</h2>
							<p>
								We use the collected information for the following purposes:
							</p>
							<ul>
								<li>Providing and maintaining our email security services</li>
								<li>Processing payments and managing accounts</li>
								<li>Communicating with you about our services</li>
								<li>Improving our services and developing new features</li>
								<li>Detecting and preventing security threats</li>
								<li>Complying with legal obligations</li>
								<li>Sending marketing communications (with your consent)</li>
							</ul>

							<h2>4. Information Sharing and Disclosure</h2>
							<p>
								We do not sell, trade, or rent your personal information. We may
								share information in the following circumstances:
							</p>

							<h3>4.1 Service Providers</h3>
							<p>
								We may share information with trusted third-party service
								providers who assist us in operating our business.
							</p>

							<h3>4.2 Legal Requirements</h3>
							<p>
								We may disclose information when required by law or to protect
								our rights and safety.
							</p>

							<h3>4.3 Business Transfers</h3>
							<p>
								In the event of a merger, acquisition, or sale of assets, your
								information may be transferred.
							</p>

							<h2>5. Data Security</h2>
							<p>
								We implement appropriate security measures to protect your
								information:
							</p>
							<ul>
								<li>Encryption of data in transit and at rest</li>
								<li>Regular security assessments and audits</li>
								<li>Access controls and authentication measures</li>
								<li>Employee training on data protection</li>
								<li>Incident response procedures</li>
							</ul>

							<h2>6. Data Retention</h2>
							<p>
								We retain your information for as long as necessary to provide
								our services and comply with legal obligations. Specific
								retention periods vary based on the type of information and
								applicable laws.
							</p>

							<h2>7. Your Rights and Choices</h2>
							<p>
								Depending on your location, you may have the following rights:
							</p>
							<ul>
								<li>Access to your personal information</li>
								<li>Correction of inaccurate information</li>
								<li>Deletion of your information</li>
								<li>Restriction of processing</li>
								<li>Data portability</li>
								<li>Objection to processing</li>
								<li>Withdrawal of consent</li>
							</ul>

							<h2>8. Cookies and Tracking Technologies</h2>
							<p>We use cookies and similar technologies to:</p>
							<ul>
								<li>Remember your preferences and settings</li>
								<li>Analyze website usage and performance</li>
								<li>Provide personalized content</li>
								<li>Improve our services</li>
							</ul>
							<p>
								You can control cookie settings through your browser
								preferences.
							</p>

							<h2>9. International Data Transfers</h2>
							<p>
								Your information may be transferred to and processed in
								countries other than your own. We ensure appropriate safeguards
								are in place to protect your information during such transfers.
							</p>

							<h2>10. Children's Privacy</h2>
							<p>
								Our services are not intended for children under 13 years of
								age. We do not knowingly collect personal information from
								children under 13.
							</p>

							<h2>11. Third-Party Links</h2>
							<p>
								Our service may contain links to third-party websites. We are
								not responsible for the privacy practices of these external
								sites.
							</p>

							<h2>12. Changes to This Privacy Policy</h2>
							<p>
								We may update this Privacy Policy from time to time. We will
								notify you of any material changes by posting the new policy on
								our website and updating the "Last updated" date.
							</p>

							<h2>13. Contact Us</h2>
							<p>
								If you have any questions about this Privacy Policy or our data
								practices, please contact us:
							</p>
							<ul>
								<li>Email: privacy@safedmarc.com</li>
								<li>Phone: +1 (555) 123-4567</li>
								<li>Address: 123 Secure Street, Cyber City, CC 12345</li>
								<li>Data Protection Officer: dpo@safedmarc.com</li>
							</ul>

							<h2>14. Regional Privacy Rights</h2>

							<h3>14.1 California Residents (CCPA)</h3>
							<p>
								California residents have additional rights under the California
								Consumer Privacy Act, including the right to know, delete, and
								opt-out of the sale of personal information.
							</p>

							<h3>14.2 European Union Residents (GDPR)</h3>
							<p>
								EU residents have rights under the General Data Protection
								Regulation, including the right to access, rectify, erase,
								restrict, and port their personal data.
							</p>

							<div className="mt-12 p-6 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-600 mb-0">
									<strong>Note:</strong> This is a draft version of our Privacy
									Policy. The actual policy may vary and should be reviewed by
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

export default Privacy;
