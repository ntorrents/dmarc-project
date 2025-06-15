import { motion } from "framer-motion";
import {
	Shield,
	TrendingUp,
	Eye,
	AlertTriangle,
	FileText,
	Wrench,
} from "lucide-react";

const Benefits = () => {
	const benefits = [
		{
			icon: Shield,
			title: "Email Protection",
			description:
				"Prevent spammers and phishing sites from sending emails using your domain name.",
		},
		{
			icon: TrendingUp,
			title: "Improve Deliverability",
			description:
				"Enhance your email deliverability by implementing DMARC effectively.",
		},
		{
			icon: Eye,
			title: "Full Visibility",
			description:
				"Maintain complete visibility over email health and detect issues within your program.",
		},
		{
			icon: AlertTriangle,
			title: "Reports & Alerts",
			description:
				"Stay informed with periodic reports on DMARC compliance and security status.",
		},
		{
			icon: FileText,
			title: "Forensic Reports",
			description:
				"Track down emails that cause DMARC compliance failures with detailed analysis.",
		},
		{
			icon: Wrench,
			title: "DNS Toolbox",
			description:
				"Comprehensive tools to diagnose and fix DNS issues like SPF, DKIM, and DMARC.",
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
		<section className="section-padding bg-white">
			<div className="container-custom">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Why Choose SafeDMARC?
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Discover what makes our email security service the right choice for
						your business
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{benefits.map((benefit) => (
						<motion.div
							key={benefit.title}
							variants={itemVariants}
							className="group">
							<div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300">
								<div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors duration-300">
									<benefit.icon className="w-6 h-6 text-primary-600" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										{benefit.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{benefit.description}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Stats Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="mt-20">
					<div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
						<div className="text-center mb-12">
							<h3 className="text-2xl md:text-3xl font-bold mb-4">
								Built for Modern Businesses
							</h3>
							<p className="text-xl text-primary-100">
								Comprehensive email security designed with your success in mind
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
							<div>
								<div className="text-4xl md:text-5xl font-bold mb-2">
									14-Day
								</div>
								<div className="text-primary-200">Free Trial</div>
							</div>
							<div>
								<div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
								<div className="text-primary-200">Uptime SLA</div>
							</div>
							<div>
								<div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
								<div className="text-primary-200">Expert Support</div>
							</div>
							<div>
								<div className="text-4xl md:text-5xl font-bold mb-2">
									30-Day
								</div>
								<div className="text-primary-200">Money Back</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Benefits;
