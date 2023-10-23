/*eslint-disable*/
import React, { useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
const logo = require("../../assets/img/she-code-africa-logo.png").default;
import Cookies from "js-cookie";
import { AiOutlineLogout } from "react-icons/ai";
import Modal from "components/Modal";
import { routes } from "utils/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
	const [collapseShow, setCollapseShow] = useState("hidden");
	const [isOpen, setIsOpen] = useState(false);
	const history = useHistory();
	const [expandedItems, setExpandedItems] = useState({});

	const handleItemClick = (name) => {
		setExpandedItems((prevState) => ({
			...prevState,
			[name]: !prevState[name], // Toggle the state for the clicked item
		}));
	};

	const logout = () => {
		Cookies.remove("isLoggedIn");
		localStorage.removeItem("token");
		history.push("/login");
	};
	const handleModal = () => {
		setIsOpen(!isOpen);
	};
	return (
		<>
			<nav
				className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6 md:overflow-y-scroll 
								scrollbar-thin
								scrollbar-thumb-pink-500 scrollbar-track-pink-300">
				<div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto ">
					{" "}
					{/* Toggler */}{" "}
					<button
						className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
						type="button"
						onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}>
						<i className="fas fa-bars"> </i>{" "}
					</button>{" "}
					{/* Brand */}{" "}
					<Link
						className="md:block text-left md:py-2 text-slate-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold py-4 px-0"
						to="/">
						<img className="logo !w-6" src={logo} alt="" />
					</Link>{" "}
					{/* User */}{" "}
					<ul className="md:hidden items-center flex flex-wrap list-none">
						<li className="inline-block relative">
							<NotificationDropdown />
						</li>{" "}
						<li className="inline-block relative">
							<UserDropdown />
						</li>{" "}
					</ul>{" "}
					{/* Collapse */}{" "}
					<div
						className={
							"md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
							collapseShow
						}>
						{" "}
						{/* Collapse header */}{" "}
						<div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-slate-200">
							<div className="flex flex-wrap">
								<div className="w-6/12">
									<Link
										className="md:block text-left md:pb-2 text-slate-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
										to="/">
										<img className="logo" src={logo} alt="" />
									</Link>{" "}
								</div>{" "}
								<div className="w-6/12 flex justify-end">
									<button
										type="button"
										className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
										onClick={() => setCollapseShow("hidden")}>
										<i className="fas fa-times"> </i>{" "}
									</button>{" "}
								</div>{" "}
							</div>{" "}
						</div>{" "}
						{/* Form */}{" "}
						<form className="mt-6 mb-4 md:hidden">
							<div className="mb-3 pt-0">
								<input
									type="text"
									placeholder="Search"
									className="px-3 py-2 h-12 border border-solid  border-slate-500 placeholder-slate-300 text-slate-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
								/>
							</div>{" "}
						</form>{" "}
						{/* Divider */} <hr className="md:min-w-full" /> {/* Heading */}{" "}
						{/* Navigation */}{" "}
						<ul className="md:flex-col md:min-w-full flex flex-col list-none mb-4">
							{routes.map(({ icon, name, label, path, items }) => (
								<li key={name} className="py-3">
									<NavLink
										to={path}
										activeClassName="text-pink-500"
										className={`${
											items ? "cursor-pointer" : ""
										} uppercase font-bold text-sm flex gap-2 items-center`}
										onClick={() => items && handleItemClick(name)}>
										<FontAwesomeIcon icon={icon} />
										{label}
										{items && (
											<div className="ml-4">
												<FontAwesomeIcon
													icon={expandedItems[name] ? faAngleUp : faAngleDown}
												/>
											</div>
										)}
									</NavLink>
									{items && expandedItems[name] && (
										<ul className="ml-8 flex flex-col gap-1.5 mt-1 list-disc">
											{items.map(({ name, label, path }) => (
												<li key={name} className="hover:text-pink-500">
													<NavLink
														to={path}
														activeClassName="text-pink-500"
														className="font-bold text-xs items-center">
														{label}
													</NavLink>
												</li>
											))}
										</ul>
									)}
								</li>
							))}
							<li className="self-end mt-1">
								<button onClick={handleModal}>
									<AiOutlineLogout />
								</button>
							</li>
						</ul>
					</div>{" "}
				</div>{" "}
			</nav>{" "}
			<Modal title="Logout" isOpen={isOpen} onClose={handleModal}>
				<div className="flex flex-col gap-y-3 justify-center">
					<div>
						<h1>Are you sure you want to logout?</h1>
					</div>
					<div className="flex gap-2 justify-center">
						<button
							className="text-white bg-red-500 rounded-lg px-4 py-1 hover:opacity-75"
							onClick={logout}>
							Yes
						</button>
						<button
							className="text-white bg-gray-500 rounded-lg px-4 py-1 hover:opacity-75"
							onClick={handleModal}>
							No
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
