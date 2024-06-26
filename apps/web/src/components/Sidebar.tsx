import React, { createContext, useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Home,
  BriefcaseBusiness,
  Send,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchSideBarData } from "../services/profileService";

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  link: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, link }) => {
  const { expanded } = useContext(SidebarContext)!;
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <Link to={link} className="text-inherit no-underline">
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800" : "hover:bg-green-50 text-gray-600"}`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-48 ml-3" : "w-0"}`}
        >
          {text}
        </span>
      </li>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const { logout } = useAuth();
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchSideBarData(token)
        .then((profile) => {
          setUser({
            username: profile.first_name + " " + profile.last_name,
            email: profile.email,
          });
        })
        .catch((error) => console.error("Error fetching profile:", error));
    }
  }, []);

  return (
    <aside className="h-screen sticky top-0 left-0">
      <nav className="h-full flex flex-col bg-white border-r border-gray-300 shadow-sm">
        <div className="p-4 flex justify-between items-center">
          <img
            src={
              process.env.PUBLIC_URL + `${expanded ? "/logo.png" : "/icon.png"}`
            }
            className="overflow-hidden transition-all h-10"
            alt="Logo"
          />
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <SidebarItem
              icon={<Home size={20} strokeWidth={2.5} />}
              text="Dashboard"
              link="/dashboard"
            />
            <SidebarItem
              icon={<BriefcaseBusiness size={20} strokeWidth={2.5} />}
              text="Jobs"
              link="/jobs"
            />
            <SidebarItem
              icon={<Send size={20} strokeWidth={2.5} />}
              text="Applications"
              link="/applications"
            />
            <SidebarItem
              icon={<User size={20} strokeWidth={2.5} />}
              text="Profile"
              link="/profile"
            />
          </ul>
        </SidebarContext.Provider>
        <div className="mt-auto mb-4 px-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center justify-start w-full p-2 my-1 font-medium rounded-md cursor-pointer transition-colors bg-green-50 hover:bg-green-100 ${expanded ? "bg-green-200" : ""}`}
          >
            <div className="bg-green-500 p-2 rounded-md">
              {expanded ? (
                <ArrowLeftToLine size={20} color="white" />
              ) : (
                <ArrowRightToLine size={20} color="white" />
              )}
            </div>
            <span className={`ml-3 ${expanded ? "block" : "hidden"}`}>
              Collapse
            </span>
          </button>
        </div>
        <div className="border-t flex p-3">
          <Link to="/profile">
            <img
              src={process.env.PUBLIC_URL + "/user.jpg"}
              className="w-10 h-10 rounded-md"
              alt="Profile"
            />
          </Link>
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-48 ml-3" : "w-0"} `}
          >
            <Link to="/profile" className="leading-4">
              <h4 className="font-semibold">{user.username}</h4>
              <span className="text-xs text-gray-600">{user.email}</span>
            </Link>
            <button onClick={logout}>
              <LogOut size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
