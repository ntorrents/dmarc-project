import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
	const auth = useAuth();

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};
