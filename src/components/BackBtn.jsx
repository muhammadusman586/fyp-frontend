import { Link } from "react-router-dom";

const BackBtn = ({ to, children }) => {
  return (
    <Link
      className="w-full flex items-center gap-4 link link-hover link-primary"
      to={to}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      <span>{children}</span>
    </Link>
  );
};

export default BackBtn;
