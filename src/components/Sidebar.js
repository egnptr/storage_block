import { useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import {
  DocumentIcon,
  UploadIcon,
  ViewGridIcon,
  CogIcon,
} from "@heroicons/react/outline";

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState("-left-64");
  return (
    <>
      <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div
        className={`h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-royal-blue w-64 z-10 py-4 px-6 transition-all duration-300`}
      >
        <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
          <div className="flex-shrink-0 flex items-center">
            <img
              className="hidden lg:block h-10 w-auto"
              src={`${process.env.PUBLIC_URL}/assets/ipfs-logo-text-128-white.png`}
              alt="Logo"
            />
          </div>
          <div className="flex flex-col">
            <hr className="my-4 min-w-full" />

            <ul className="flex-col min-w-full flex list-none">
              <li className="rounded-lg mb-4">
                <NavLink
                  to="/"
                  exact
                  className="flex items-center gap-4 text-sm text-white font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-royal-dark-blue text-white shadow-md"
                >
                  <ViewGridIcon className="block h-6 w-6 text-royal-light-blue" />
                  Dashboard
                </NavLink>
              </li>
              <li className="rounded-lg mb-2">
                <NavLink
                  to="/upload"
                  className="flex items-center gap-4 text-sm text-white font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-royal-dark-blue text-white shadow-md"
                >
                  <UploadIcon className="block h-6 w-6 text-royal-light-blue" />
                  Upload
                </NavLink>
              </li>
              <li className="rounded-lg mb-2 ">
                <NavLink
                  to="/files"
                  className="flex items-center gap-4 text-sm text-white font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-royal-dark-blue text-white shadow-md"
                >
                  <DocumentIcon className="block h-6 w-6 text-royal-light-blue" />
                  Files
                </NavLink>
              </li>
              <li className="rounded-lg mb-2 ">
                <NavLink
                  to="/settings"
                  className="flex items-center gap-4 text-sm text-white font-light px-4 py-3 rounded-lg"
                  activeClassName="bg-royal-dark-blue text-white shadow-md"
                >
                  <CogIcon className="block h-6 w-6 text-royal-light-blue" />
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
