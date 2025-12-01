import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import CardStats from "../components/Cards/CardStats.js";
import GoogleCard from "./googlecard.js";
import Cookies from "js-cookie";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PROPERTY_ID = process.env.REACT_APP_GA_PROPERTY_ID;
const CLIENT_ID = process.env.GA_CLIENT_ID;

const GoogleAnalytics = () => {
	const prop_id = PROPERTY_ID;
	const startDate = "today";
	const endDate = "today";
	const GAITEM = localStorage.getItem("GA_token");
	const GASTAT = localStorage.getItem("googleIn");
	const [totalViews, setTotalViews] = useState("");
	const [gaLogged, setGaLogged] = useState(false);
	const [loading, setLoading] = useState(false);

	const googleLogin = useGoogleLogin({
		clientID: CLIENT_ID,
		scope:
			"https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly",
		include_granted_scopes: true,
		onSuccess: async (tokenResponse) => {
			const accessToken = tokenResponse?.access_token;
			if (accessToken) {
				Cookies.set("googleIn", true);
				localStorage.setItem("GA_token", accessToken);
				localStorage.setItem("googleIn", true);
				fetchData(accessToken);
			}
		},
		onError: (error) => {
			toast.error("Google Login Failed");
		},
	});

	const fetchData = async (accessToken) => {
		setLoading(true);
		try {
			const headers = {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			};
			const requestBody = {
				metrics: [{ name: "screenPageViews" }],
				dateRanges: [
					{
						startDate: startDate,
						endDate: endDate,
					},
				],
			};

			const response = await Axios.post(
				`https://analyticsdata.googleapis.com/v1beta/properties/${prop_id}:runReport`,
				requestBody,
				{ headers }
			);

			const data = response.data;
			if (data && data.rowCount > 0) {
				let gaViews = data.rows[0].metricValues[0].value || 0;
				setTotalViews(gaViews);
				setGaLogged(true);
			} else {
				setTotalViews(0);
			}
			return data;
		} catch (error) {
			if (error.response && error.response.data.error.code === 401) {
				localStorage.setItem("googleIn", false);
				setGaLogged(false);
				toast.error("Google Auth expired");
			} else {
				toast.error("Error fetching analytics");
			}
			return null;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (GASTAT === "false") {
			setGaLogged(false);
		} else if (GAITEM && GAITEM != null) {
			fetchData(GAITEM);
			setGaLogged(true);
		} else {
			setGaLogged(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{gaLogged ? (
				<CardStats
					statSubtitle="DAILY WEBSITE VISIT"
					statTitle={loading ? "Loading..." : totalViews}
					statDescripiron="Today's page views"
					statIconColor="bg-sky-500"
				/>
			) : (
				<GoogleCard
					statSubtitle="DAILY WEBSITE VISIT"
					statTitle={googleLogin}
					statDescripiron="Today's page views"
					statIconColor="bg-sky-500"
				/>
			)}
		</>
	);
};
export default GoogleAnalytics;
