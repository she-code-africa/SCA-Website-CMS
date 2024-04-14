import React, { useEffect, useState } from "react";

// components

import CardStats from "components/Cards/CardStats.js";
import { useQuery } from "react-query";
import { getUsers } from "services";
import { getEvents } from "services";
import { getMembers } from "services";
import GoogleAnalytics from "analytics";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = process.env.REACT_APP_GA_CLIENT_ID;

export default function HeaderStats() {
	const { data: totalUsers, isLoading: loadingUsers } = useQuery(
		"users",
		getUsers
	);
	const { data: totalEvents, isLoading: loadingEvents } = useQuery(
		"events",
		getEvents
	);
	const { data: totalMembers, isLoading: loadingMembers } = useQuery(
		"teams",
		getMembers
	);
	const [totalActiveEvents, setTotalActiveEvents] = useState();
	useEffect(() => {
		if (totalEvents) {
			let activeEvents = totalEvents.filter((event) => {
				return event.eventDate >= Date.now();
			});
			setTotalActiveEvents(activeEvents.length);
		}
	}, [totalEvents]);
	return (
		<>
			{/* Header */}
			<div className="relative bg-pink-500 md:pt-32 pb-32 pt-12">
				<div className="px-4 md:px-10 mx-auto w-full">
					<div>
						{/* Card stats */}
						<div className="flex flex-wrap">
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									isLoading={loadingUsers}
									statSubtitle="TOTAL USERS"
									statTitle={`${totalUsers && totalUsers.length}`}
									statIconName="far fa-chart-bar"
									statIconColor="bg-red-500"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									isLoading={loadingEvents}
									statSubtitle="TOTAL EVENTS"
									statTitle={`${totalEvents && totalEvents.length}`}
									statIconName="fas fa-chart-pie"
									statIconColor="bg-orange-500"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									isLoading={loadingEvents}
									statSubtitle="ACTIVE PROGRAMS"
									statTitle={`${totalActiveEvents && totalActiveEvents}`}
									statIconName="fas fa-users"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									isLoading={loadingMembers}
									statSubtitle="TOTAL TEAM MEMBERS"
									statTitle={`${totalMembers && totalMembers.length}`}
									statIconName="fas fa-user"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<GoogleOAuthProvider clientId={CLIENT_ID}>
									<GoogleAnalytics />
								</GoogleOAuthProvider>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
