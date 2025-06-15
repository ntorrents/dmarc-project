import { motion } from "framer-motion";
import {
	Shield,
	Mail,
	Eye,
	AlertTriangle,
	BarChart3,
	Settings,
} from "lucide-react";

const Services = () => {
	const services = [
		{
			icon: Shield,
			title: "Email Protection",
			description:
				"Prevent spammers and phishing sites from sending emails using your domain name.",
			features: [
				"Domain spoofing protection",
				"Brand reputation security",
				"Real-time threat blocking",
			],
		},
		{
			icon: Mail,
			title: "Improve Deliverability",
			description:
				"Enhance your email deliverability rates by implementing DMARC effectively.",
			features: [
				"Inbox placement optimization",
				"Sender reputation management",
				"Authentication protocols",
			],
		},
		{
			icon: Eye,
			title: "Full Visibility",
			description:
				"Maintain complete visibility over your email ecosystem and detect issues quickly.",
			features: [
				"Comprehensive reporting",
				"Real-time monitoring",
				"Issue detection & alerts",
			],
		},
		{
			icon: AlertTriangle,
			title: "Threat Intelligence",
			description:
				"Advanced threat detection and analysis to stay ahead of email security risks.",
			features: [
				"Phishing detection",
				"Malware analysis",
				"Attack pattern recognition",
			],
		},
		{
			icon: BarChart3,
			title: "Analytics & Reports",
			description:
				"Detailed analytics and customizable reports to track your email security posture.",
			features: [
				"Custom dashboards",
				"Compliance reporting",
				"Performance metrics",
			],
		},
		{
			icon: Settings,
			title: "Easy Configuration",
			description:
				"Simple setup process with guided configuration and ongoing support.",
			features: ["One-click setup", "DNS management", "Expert support"],
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<section className="section-padding bg-gray-50">
			<div className="container-custom">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Comprehensive Email Security Solutions
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Protect your organization with our complete suite of email
						authentication and security services designed for modern businesses.
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{services.map((service) => (
						<motion.div
							key={service.title}
							variants={itemVariants}
							className="group">
							<div className="card h-full hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
								<div className="flex items-center mb-4">
									<div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
										<service.icon className="w-6 h-6 text-white" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900">
										{service.title}
									</h3>
								</div>

								<p className="text-gray-600 mb-6 leading-relaxed">
									{service.description}
								</p>

								<ul className="space-y-2">
									{service.features.map((feature, featureIndex) => (
										<li
											key={featureIndex}
											className="flex items-center text-sm text-gray-500">
											<div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
											{feature}
										</li>
									))}
								</ul>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="text-center mt-16">
					<div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
						<h3 className="text-2xl md:text-3xl font-bold mb-4">
							Ready to Secure Your Email?
						</h3>
						<p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
							Join thousands of businesses that trust SafeDMARC to protect their
							email communications.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className="btn-secondary">Start Free Trial</button>
							<button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
								Schedule Demo
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Services;
