import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer className="block py-4 right-0 absolute left-0 bottom-0">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-slate-200" />
          <div className="text-sm text-slate-500 font-semibold py-1 text-center ">
            Copyright © {new Date().getFullYear()}{" "}
            <a
              href="https://shecodeafrica.org/"
              className="text-slate-500 hover:text-slate-700 text-sm font-semibold py-1"
            >
              SheCodeAfrica
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
