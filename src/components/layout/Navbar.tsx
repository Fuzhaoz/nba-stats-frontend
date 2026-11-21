
import { NavLink } from "react-router-dom";
import { Activity, UserRound } from "lucide-react";

const navigation = [
    { label: "Home", path: "/" },
    { label: "Games", path: "/games" },
    { label: "Standings", path: "/standings" },
    { label: "Teams", path: "/teams" },
    { label: "Players", path: "/players" },
];

export default function Navbar() {
    return (
        <header className="border-b border-slate-800 bg-slate-950">
            <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">

                <NavLink to="/" className="flex items-center gap-2">
                    <Activity size={28} className="text-orange-500" />
                    <span className="text-2xl font-black tracking-tight text-white">
            COURTSIDE.
          </span>
                </NavLink>

                <div className="flex flex-wrap items-center gap-6">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                isActive
                                    ? "font-semibold text-orange-400"
                                    : "text-slate-400 transition hover:text-white"
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    <UserRound size={20} />
                    <span className="text-sm">Login</span>
                </div>

            </nav>
        </header>
    );
}
