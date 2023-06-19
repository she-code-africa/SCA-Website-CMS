import React, { useEffect, useState } from "react";

// components

import CardStats from "components/Cards/CardStats.js";
import { useQuery } from "react-query";
import { getUsers } from "services";
import { getEvents } from "services";

export default function HeaderStats() {
	const { data: totalUsers } = useQuery("users", getUsers);
	const { data: totalEvents } = useQuery("events", getEvents);
	console.log(totalEvents);
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
									statSubtitle="TOTAL USERS"
									statTitle={totalUsers && totalUsers.length}
									statIconName="far fa-chart-bar"
									statIconColor="bg-red-500"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									statSubtitle="TOTAL EVENTS"
									statTitle={totalEvents && totalEvents.length}
									statIconName="fas fa-chart-pie"
									statIconColor="bg-orange-500"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									statSubtitle="ACTIVE PROGRAMS"
									statTitle={totalActiveEvents && totalActiveEvents}
									statIconName="fas fa-users"
								/>
							</div>
							<div className="w-full lg:w-6/12 xl:w-3/12 px-4">
								<CardStats
									statSubtitle="DAILY WEBSITE VISIT"
									statTitle="49,650"
									statDescripiron="22/03/2023"
									statIconColor="bg-sky-500"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
