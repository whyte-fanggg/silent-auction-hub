import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Empowering Communities Through Auctions
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Silent Auction Hub is the simplest way to bid, win, and support local causes.
        </p>
        <div className="flex gap-4">
          <Link
            to="/auctions"
            className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700"
          >
            View Auctions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;