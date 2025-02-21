import PropTypes from "prop-types";
import "./PriceCard.css";

function PriceCard({ title, body, price }) {
	return (
		<div className="card">
			<h3>{title}</h3>
			<p className="priceBody">{body}</p>
			<p>
				<strong>{price}</strong>
			</p>
			<button className="btn-secondary">Seleccionar</button>
		</div>
	);
}

PriceCard.propTypes = {
	title: PropTypes.string.isRequired,
	body: PropTypes.string.isRequired,
	price: PropTypes.string.isRequired,
};

export default PriceCard;
