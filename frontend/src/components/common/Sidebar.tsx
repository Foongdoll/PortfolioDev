import { Link } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Experience", path: "/experience" },
    { name: "Projects", path: "/projects" },
    { name: "TechLog", path: "/techlog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="fixed top-[30%] left-10 z-50 bg-[#1e3e79]/90 rounded-2xl shadow-lg backdrop-blur-md">
      <h2 className="text-2xl font-bold p-4 text-white">Menu</h2>
      <ul className="flex flex-col">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className="p-4 text-white hover:bg-[#335a9e] rounded-2xl transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1"
          >
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
