import React, { useState, Text } from "react";
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
import DatePicker from "react-datepicker";

// components
const ActivityList = () => {
    const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const { data, isLoading } = useQuery(
        ["activityLog", currentPage, itemsPerPage], 
        ()=> getActivityLog(currentPage, itemsPerPage), 
        {
            keepPreviousData: true,
            onError: (error) => {
                toast.error("Error Fetching Activity Log(s)");
            },
	});
    const activityLog = data?.data || [];
    const totalAvailableLogs = data?.totalAvailableLogs || 0;
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm
		shadow focus:outline-none focus:ring !py-3 w-full ease-linear transition-all duration-150 basis-9/12`;

    // add start and end dates to logs query; increase limi to 500 to reduce loops
    const fetchDateRangeLogsForExport = async (startDate, endDate) => {
        setIsExporting(true);
        let allData = [];
        let currentPage = 1;
        const limit = 500;

        try {
            while (true) {
                const response = await getActivityLog(currentPage, limit, startDate, endDate);
                const pageData = response.data || [];
                const totalPages = response.totalPages || 1;
                if (pageData.length === 0) {
                    break; 
                }
                allData = [...allData, ...pageData];
                currentPage++;
                if (currentPage > totalPages) {
                    break;
                }
            }
            
            const filename = `activity_log_${moment(startDate).format('DD-MM-YYYY')}_to_${moment(endDate).format('DD-MM-YYYY')}.csv`;
            exportDataToCSV(allData, filename);
            toast.success(`Exported ${allData.length} records successfully!`);
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Error exporting data");
        } finally {
            setIsExporting(false);
            setShowDownloadModal(false);
        }
    };

    const exportDataToCSV = (data, filename) => {
        if (!data || !data.length) {
            toast.error("No data to export!");
            setIsExporting(false);
            return;
        }
        const headers = header.map(h => h.label);
        const csvRows = [
            headers.join(","),
            ...data.map(row => {
                const user = row.user || {};
                const oldDoc = row.oldDoc || {};
                const newDoc = row.newDoc || {};
                
                return [
                    `"${(user.firstName || '')} ${(user.lastName || '')}"`,
                    `"${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}"`,
                    `"${row.action ? row.action.charAt(0).toUpperCase() + row.action.slice(1) : ''}"`,
                    `"${row.page || ''}"`,
                    `"${oldDoc.name || 'N/A'}"`,
                    `"${newDoc.name || ''}"`,
                    `"${moment(row.createdAt).format("DD MMM, YYYY")}"`,
                    `"${moment(row.updatedAt).format("DD MMM, YYYY")}"`
                ].join(",");
            })
        ];

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        // create download linkk for data blob
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setIsExporting(false);
    };

    const handleExport = () => {
        setIsExporting(true);
        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            setIsExporting(false);
            return;
        }
        
        if (startDate > endDate) {
            toast.error("Start date cannot be after end date");
            setIsExporting(false);
            return;
        }
        fetchDateRangeLogsForExport(startDate, endDate);
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
                            <button
                                className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
                                onClick={() => setShowDownloadModal(true)}>
                                Export
                            </button>
						</div>
					</div>
				</div>
                <Table width="full">
                    <TableHeaderRow className="grid grid-cols-8 gap-x-4">
							{header.map(({ label }, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							})}
							<TableHeader></TableHeader>
					</TableHeaderRow>
                    <TableBody loading={isLoading} >
                        {activityLog
                            .map((data) => {
                                const {
                                    user,
                                    action,
                                    page,
                                    oldDoc,
                                    newDoc,
                                    createdAt,
                                    updatedAt,
                                    _id,
                                } = data;
                                return (
                                        <TableDataRow 
                                            onClick={()=> {
                                            }}
                                            key={_id}
                                            className="grid grid-cols-8 px-4 py-3 gap-x-4 bg-white">
                                            <TableData>
												<span>{user.firstName} {user.lastName}</span>
											</TableData>
                                            <TableData>
												<span>{user.role.charAt(0).toUpperCase()}{user.role.slice(1)}</span>
											</TableData>
											<TableData>{action.charAt(0).toUpperCase()}{action.slice(1)}</TableData>
											<TableData>{page}</TableData>
											<TableData>{oldDoc ? oldDoc.name : 'N/A'}</TableData>
											<TableData>{newDoc.name}</TableData>
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
                        totalItems={totalAvailableLogs}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </Table>
            </div>
        </div>
        {/* download modal */}
        { showDownloadModal && (
            <Modal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                title="Export Activity Logs"
            >
                <div className="w-full px-4 md:px-8">
                <div className="flex flex-col w-full gap-y-3">
                    <div className="relative w-full mb-3 flex items-center ">
                        <label
                            className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
                            htmlFor="startDate">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDate ? new Date(startDate) : new Date()}
                            dateFormat="yyyy-MM-dd"
                            onChange={(date) => setStartDate(date) }
                            className={`${inputClass} ml-6 !w-[95%]`}
                        />
                    </div>
                    
                    <div className="relative w-full mb-3 flex items-center ">
                        <label className="block uppercase text-slate-600 text-xs font-bold basis-3/12">
                            End Date
                        </label>
                        <DatePicker
                            selected={endDate ? new Date(endDate) : new Date()}
                            dateFormat="yyyy-MM-dd"
                            onChange={(date) => setEndDate(date) }
                            className={`${inputClass} ml-6 !w-[95%]`}
                        />
                    </div>
                    
                    <div className="my-4 w-full flex">
                        <button
                            className="active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
                            onClick={() => { setShowDownloadModal(false); setIsExporting(false); }}>
                            Cancel
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
                        >
                            {isExporting ? "Exporting..." : "Export CSV"}
                        </button>
                    </div>
                    </div>
                </div>
            </Modal>
        ) }
		<ToastContainer />
        
        </>
    )
};
export default ActivityList;