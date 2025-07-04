// src/components/dashboard/RecentActivity.jsx
import PropTypes from "prop-types";

const RecentActivity = ({ logs }) => {
	return (
		<div className="rounded-2xl shadow p-4">
			<h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
			<ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
				{logs.length === 0 && (
					<li className="text-gray-500">No hay actividad reciente.</li>
				)}
				{logs.map((log) => (
					<li key={log.id} className="border-b pb-2 last:border-none">
						<div className="text-sm text-gray-700">
							<span className="font-medium">{log.user}</span>{" "}
							{log.action.toLowerCase()}{" "}
							<span className="italic">{log.target}</span>
						</div>
						<div className="text-xs text-gray-400">
							{log.time.toLocaleString()} — IP {log.ip}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
RecentActivity.propTypes = {
	logs: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			user: PropTypes.string.isRequired,
			action: PropTypes.string.isRequired,
			target: PropTypes.string.isRequired,
			time: PropTypes.instanceOf(Date).isRequired,
			ip: PropTypes.string.isRequired,
		})
	).isRequired,
};

export default RecentActivity;
