import PropTypes from "prop-types";
import "./ServiceCard.css";

function ServiceCard({ title, body }) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p>{body}</p>
        </div>
    );
}

ServiceCard.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
};

export default ServiceCard;
