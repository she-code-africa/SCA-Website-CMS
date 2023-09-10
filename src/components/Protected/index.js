import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";
function Protected({ children }) {
	const [isLoggedIn] = useState(Cookies.get("isLoggedIn"));
	return (
		<>{!isLoggedIn ? <Redirect to="/account/login" replace /> : children}</>
	);
}
export default Protected;
