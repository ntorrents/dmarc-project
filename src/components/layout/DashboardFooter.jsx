const DashboardFooter = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
			<div className="container-custom">
				<div className="flex flex-col md:flex-row justify-center items-center text-sm text-gray-600">
					<p>© {currentYear} SafeDMARC. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default DashboardFooter;
