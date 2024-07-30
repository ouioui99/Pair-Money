import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full h-20 flex items-center justify-center">
      <h1>Home</h1>
      <div>
        <Link to="/login">login</Link> | <Link to="/signup">About</Link>
      </div>
    </div>
  );
}
