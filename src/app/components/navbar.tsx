"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  interface UserInfo {
    FirstName: string;
    LastName: string;
    Image?: string; // Base64 image string
    Role: string;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (status === "authenticated") {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get("/api/user");
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };

      fetchUserInfo();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [status]);

  if (!isClient) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full drop-shadow-lg z-50 transition-all duration-300 bg-white shadow-lg py-2">
      <div className="flex items-center justify-between px-6 md:px-20 py-2">
        <div className="flex justify-start">
          <Image
            src="/logo-fmsbd.png"
            alt="Flood Rescue Initiative"
            width={100}
            height={30}
          />
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 focus:outline-none"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="hidden md:flex flex-1 justify-center space-x-8">
          {status === "authenticated" ? (
            <>
              <a href="/feed" className="text-gray-600 hover:text-blue-600">
                Feed
              </a>
              <a href="/map" className="text-gray-600 hover:text-blue-600">
                Maps
              </a>
              <a href="/chat" className="text-gray-600 hover:text-blue-600">
                Messages
              </a>
              <a
                href="/flood-information"
                className="text-gray-600 hover:text-blue-600"
              >
                Educational Contents
              </a>
              <a
                href="/emergency-aid"
                className="text-gray-600 hover:text-blue-600"
              >
                Emergency Aid
              </a>
              <a href="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </a>
            </>
          ) : (
            <>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                Home
              </a>
              <a href="#about-us" className="text-gray-600 hover:text-blue-600">
                About Us
              </a>
              <a href="#join" className="text-gray-600 hover:text-blue-600">
                Join Us
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </a>
              <a
                href="/flood-information"
                className="text-gray-600 hover:text-blue-600"
              >
                Educational Contents
              </a>
              <a
                href="/emergency-aid"
                className="text-gray-600 hover:text-blue-600"
              >
                Emergency Aid
              </a>
            </>
          )}
        </div>

        <div className="hidden md:flex justify-end">
          {status === "authenticated" ? (
            <div className="flex items-center space-x-4">
              {userInfo?.Image && (
                <Image
                  src={`data:image/jpeg;base64,${userInfo.Image}`}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-gray-600 font-semibold">
                  {userInfo?.FirstName} {userInfo?.LastName}
                </p>
                <p
                  className={`text-sm ${
                    userInfo?.Role.toLowerCase() === "user"
                      ? "text-blue-500"
                      : userInfo?.Role.toLowerCase() === "admin"
                      ? "text-red-500"
                      : "text-green-500" // default to volunteer color if not user or admin
                  }`}
                >
                  {userInfo?.Role}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className=" text-red-500 hover:text-white py-2 px-4 rounded-full hover:bg-gradient-to-r hover:from-bg-red-300  hover:to-bg-red-600 transition-all flex border-red-200 items-center border-2"
              >
                <Image
                  src={"/logout.png"}
                  alt="logout icon"
                  width={25}
                  height={20}
                  className="mr-2"
                />
                Logout
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-all"
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
