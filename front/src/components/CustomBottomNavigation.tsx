import { useNavigate, useLocation } from "react-router-dom";

export default function CustomBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const baseClass =
    "inline-flex flex-col items-center justify-center px-5 group";
  const activeIconClass = "text-blue-600 dark:text-blue-500";
  const inactiveIconClass =
    "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500";

  return (
    <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        {/* Home */}
        <button
          type="button"
          className={`${baseClass} rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800`}
          onClick={() => navigate("/")}
        >
          <svg
            className={`w-5 h-5 mb-1 ${
              isActive("/") ? activeIconClass : inactiveIconClass
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M19.707 9.293l-2-2-7-7a1 1 0 00-1.414 0l-7 7-2 2a1 1 0 001.414 1.414L2 10.414V18a2 2 0 002 2h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a2 2 0 002-2v-7.586l.293.293a1 1 0 001.414-1.414z" />
          </svg>
          <span className="sr-only">Home</span>
        </button>

        {/* Spending Index */}
        <button
          type="button"
          className={`${baseClass} hover:bg-gray-50 dark:hover:bg-gray-800`}
          onClick={() => navigate("/spending-index")}
        >
          <svg
            className={`w-5 h-5 mb-1 ${
              isActive("/spending-index") ? activeIconClass : inactiveIconClass
            }`}
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 12.25V1m0 11.25a2.25 2.25 0 000 4.5m0-4.5a2.25 2.25 0 010 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 000 4.5m0-4.5a2.25 2.25 0 010 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5M16 19v-2"
            />
          </svg>
          <span className="sr-only">Spending</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          className={`${baseClass} rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800`}
          onClick={() => navigate("/mypage")}
        >
          <svg
            className={`w-5 h-5 mb-1 ${
              isActive("/mypage") ? activeIconClass : inactiveIconClass
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1010 10A10.011 10.011 0 0010 0zm0 5a3 3 0 110 6 3 3 0 010-6zm0 13a8.949 8.949 0 01-4.951-1.488A3.987 3.987 0 019 13h2a3.987 3.987 0 013.951 3.512A8.949 8.949 0 0110 18z" />
          </svg>
          <span className="sr-only">Profile</span>
        </button>
      </div>
    </div>
  );
}
