import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { useMutation } from "react-query";
import { login } from "services";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const logo = require("../../assets/img/she-code-africa-logo.png").default;

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const history = useHistory();

	const { mutate, isLoading: loading } = useMutation(login, {
		onSuccess: (data) => {
			Cookies.set("isLoggedIn", true);
			localStorage.setItem("token", data);
			history.push("/admin");
		},
		onError: () => {
			setError(true);
		},
	});

	const signin = () => {
		mutate({ email, password });
		console.log(loading);
	};

	return (
		<>
			<div className="container mx-auto px-4 h-full">
				<div className="flex content-center items-center justify-center h-full">
					<div className="w-full lg:w-4/12 px-4">
						<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-200 border-0">
							<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
								<form className="mt-5">
									<div>
										<img className="logo" src={logo} alt="" />
									</div>
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="grid-password">
											Email
										</label>
										<input
											type="email"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											placeholder="Email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>

									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="grid-password">
											Password
										</label>
										<input
											type="password"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											placeholder="Password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
									</div>
									{error && (
										<div className=" mb-3">
											<p className="text-xs text-red-500">
												Invalid Password or Email, try again
											</p>
										</div>
									)}
									<div>
										<label className="inline-flex items-center cursor-pointer">
											<input
												id="customCheckLogin"
												type="checkbox"
												className="form-checkbox border-0 rounded text-slate-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
											/>
											<span className="ml-2 text-sm font-semibold text-slate-600">
												Remember me
											</span>
										</label>
									</div>

									<div className="text-center mt-6">
										<button
											className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 hover:opacity-60 flex justify-center items-center"
											type="button"
											onClick={() => signin()}>
											{loading ? (
												<AiOutlineLoading3Quarters className="animate-spin" />
											) : (
												"Sign In"
											)}
										</button>
									</div>
								</form>
							</div>
						</div>
						<div className="flex flex-wrap mt-6 relative">
							<div className="w-1/2">
								<a
									href="#pablo"
									onClick={(e) => e.preventDefault()}
									className="text-slate-200">
									<small>Forgot password?</small>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
