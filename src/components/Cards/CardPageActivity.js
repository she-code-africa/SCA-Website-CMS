import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getActivityLog } from "services";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import { activityloglist as header } from "utils/headers";
import Modal from "components/Modal";
import Loader from "components/Loader";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "components/Pagination";
import ActivityLogModal from "components/ActivityLog/ActivityModal";


const ActivityList = () => {
    const [activityLog, setActivity] = useState([]);
	const [selectedId, setSelectedId] = useState();
    const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const itemsPerPage = 10;
	const { isLoading } = useQuery("activityLog", getActivityLog, {
		onSuccess: (data) => {
			setActivity(data);
		},
		onError: () => {
			toast.error("Error Fetching Activity Log(s)");
		},
	});

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
        <div className = "flex w-full px-4" >
            <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"}>
                <div className="rounded-t mb-0 px-4 py-3 border-0 pb-0">
					<div className="flex flex-wrap items-center">
						<div className="relative w-full px-2 max-w-full flex justify-between flex-grow flex-1">
							<h3 className={"font-semibold text-lg  text-slate-700"}>
								Activity Log
							</h3>
						</div>
					</div>
				</div>
                <Table width="full">
                    <TableHeaderRow className="grid grid-cols-7 gap-x-4">
							{header.map(({ label }, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							})}
							<TableHeader></TableHeader>
					</TableHeaderRow>
                    <TableBody loading={isLoading} >
                        {activityLog
                            ?.slice(
                                (currentPage - 1) * itemsPerPage,
                                currentPage * itemsPerPage
                            )
                            .map((data) => {
                                const {
                                    user,
                                    page,
                                    action,
                                    createdAt,
                                    updatedAt,
                                    _id,
                                } = data;
                                return (
                                        <TableDataRow 
                                            onClick={()=> {
                                                handleModal();
                                                setSelectedId(data);
                                            }}
                                            key={_id}
                                            className="grid grid-cols-7 px-4 py-3 gap-x-4 bg-white">
                                            <TableData>
												<span>{user.firstName} {user.lastName}</span>
											</TableData>
											<TableData>{page}</TableData>
											<TableData>{action}</TableData>
											<TableData>
												{moment(createdAt).format("DD MMM, YYYY")}
											</TableData>
											<TableData>
												{moment(updatedAt).format("DD MMM, YYYY")}
											</TableData>
                                        </TableDataRow>
                                    );
                                }
                            )}
                    </TableBody>
                    <Pagination
                        totalItems={activityLog?.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </Table>
            </div>
            { isModalOpen && (
                <ActivityLogModal
                    isOpen={isModalOpen}
                    handleModal={handleModal}
                    activityLogDetails={selectedId}
                 />
            )}
        </div>
			<ToastContainer />
        </>
    )
};
export default ActivityList;