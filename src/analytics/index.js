import React, { useEffect, useState } from 'react';
import { useGoogleLogin  } from '@react-oauth/google';
import CardStats from "../components/Cards/CardStats.js";
import GoogleCard from "./googlecard.js";
import Cookies from "js-cookie";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PROPERTY_ID = process.env.REACT_APP_GA_PROPERTY_ID;
const CLIENT_ID = process.env.GA_CLIENT_ID;


const GoogleAnalytics  = () => {
    const prop_id = PROPERTY_ID;
    const startDate = "today";
    const endDate = "today";
    const GAITEM = localStorage.getItem("GA_token");
    const GASTAT = localStorage.getItem("googleIn");
    const [totalViews, setTotalViews] = useState('');
    const [gaLogged, setGaLogged] = useState(true);
    
    const googleLogin = useGoogleLogin ({
        clientID: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly',
        include_granted_scopes: true,
        onSuccess: async (tokenResponse) => {
            const accessToken = tokenResponse?.access_token;
            if (accessToken) {
                Cookies.set("googleIn", true);
                localStorage.setItem("GA_token", accessToken);
                localStorage.setItem("googleIn", true);
                window.location.reload();
            }
        },
        onError: (error) => {
            console.error("error");
            console.error(error);
        }
    });

    const fetchData = async (accessToken) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            };
            const requestBody = {
                metrics: [{ name: "screenPageViews" }],
                dateRanges: [{
                    startDate: startDate,
                    endDate: endDate
                }]
            };

            return Axios.post(`https://analyticsdata.googleapis.com/v1beta/properties/${prop_id}:runReport`,
               requestBody, { headers })
            .then(response => response.data)
                .catch(error => {
                    // console.log('error -----', error.response.data.error.code);
                    if (error.response && error.response.data.error.code === 401) {
                        localStorage.setItem("googleIn", false);
                    }
                    else{
                        console.error('Error fetching data:', error);
                    }
                
                return null; 
            });
        } 
        catch (error) {
            console.error(error);
        }
    };


    useEffect( ()=> {
        if (GASTAT == 'false') { 
            setGaLogged(false); 
            toast.error("Google Authentication Error.");
            console.log('login now');
        }
        else if (GAITEM != null) {
            fetchData(GAITEM)
            .then(data => {
                // console.log(data);
                if (data.rowCount > 0){
                    let gaViews = data.rows[0].metricValues[0].value|| 0;
                    setTotalViews(gaViews);
                } else {
                    setTotalViews(0);
                }
            })
            ;
        } else {
            console.log('login now');
            toast.error("Google Authentication Error.");
            setGaLogged(false);

        }
    }, [GAITEM, GASTAT]
    );

    return(
        <>
        { gaLogged ? (
            <CardStats
			statSubtitle="DAILY WEBSITE VISIT"
			statTitle= {`${totalViews && totalViews}`}
			statDescripiron="today's date"
			statIconColor="bg-sky-500"
        />
        ) : (
            <GoogleCard
            statSubtitle="DAILY WEBSITE VISIT"
			statTitle= {googleLogin}
			statDescripiron="today's date"
			statIconColor="bg-sky-500"
            />
        )

        }       
        </>
    );
};
export default GoogleAnalytics;