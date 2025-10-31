import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "TechLog", path: "/techlog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <aside
      className="
        fixed top-[30%] left-10 z-50
        w-52
        rounded-2xl border border-slate-200 bg-white/90
        shadow-sm backdrop-blur-sm
      "
      aria-label="Site navigation"
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <span className="text-sky-500 text-xl font-black">&lt;/&gt;</span>
        <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
      </div>

      <nav className="px-2 pb-3">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  [
                    "block w-full rounded-xl px-4 py-2 text-sm",
                    "text-slate-700 hover:bg-slate-50",
                    "border border-transparent hover:border-slate-200",
                    "transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    isActive
                      ? "bg-sky-50 text-sky-700 border-sky-200"
                      : "",
                  ].join(" ")
                }
                end
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
