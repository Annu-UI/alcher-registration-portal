import React from "react";
import { Link } from "react-router-dom";
import bg404 from "../assets/background-pattern.svg";
export default function Err404Page() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg404})`, // use the imported image
      }}
    >
      <h1 className="text-8xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Oops! Page not found </h2>
      {/* <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Go back Home
      </Link> */}
    </div>
  );
}