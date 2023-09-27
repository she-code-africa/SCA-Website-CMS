import React from "react";
import avatar from "../../assets/img/avatar.png";
import image from "../../assets/img/placeholder-image.jpg";

const Placeholder = ({ name }) => {
	return (
		<>
			{
				(name = "image" ? (
					<img src={image} alt="placholder" className="rounded-full max-h-40" />
				) : (
					<img src={avatar} alt="no avatar" className="rounded-full" />
				))
			}
		</>
	);
};

export default Placeholder;
