import React from "react";

export default function FooterSmall (props) {
  return (
    <>
      <footer
        className={
          (props.absolute
            ? "absolute w-full bottom-0 bg-slate-800"
            : "relative") + " pb-6"
        }
      >
        <div className="container mx-auto px-4">
          <hr className="mb-6 border-b-1 border-slate-600" />
          <div className="w-full  text-center px-4">
            <div className="text-sm text-slate-500 font-semibold py-1 text-center ">
              Copyright © {new Date().getFullYear()}{" "}
              <a
                href="https://shecodeafrica.org"
                className="text-white hover:text-slate-300 text-sm font-semibold py-1"
              >
                SheCodeAfrica
              </a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}
