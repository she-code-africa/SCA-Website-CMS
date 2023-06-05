import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import "assets/styles/index.css";

// layouts

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import "./index.css";
// import Index from "views/Index.js";
const queryClient = new QueryClient();

ReactDOM.render(
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<Switch>
				{/* add routes with layouts */}
				<Route path="/admin" component={Admin} />
				<Route path="/" component={Auth} />
				{/* add routes without layouts */}
				<Route path="/landing" exact component={Landing} />
				<Route path="/profile" exact component={Profile} />
				{/* <Route path="/" exact component={Admin} /> */}
				{/* add redirect for first page */}
				<Redirect from="*" to="/" />
			</Switch>
		</BrowserRouter>
	</QueryClientProvider>,
	document.getElementById("root")
);
