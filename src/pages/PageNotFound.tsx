import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="text-5xl flex flex-col gap-5 justify-center items-center h-screen">
      <h1>Page Not Found</h1>{" "}
      <Link
        to={"/"}
        className="bg-purple text-black rounded-xl px-3 py-1 hover:ring-offset-2 hover:ring-offset-blackbg hover:ring-1 hover:ring-purple transition-all ease-linear duration-150"
      >
        Go to home
      </Link>
    </div>
  );
}
