import React from "react";
import Image from "next/image";
import styles from "../app/qr.module.css";
const Navbar = () => {
  return (
    <>
      <nav className={styles.nav}>
        <header className="body-font">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a className="flex title-font font-medium items-center mb-4 md:mb-0">
              <Image
                src="/hello_logo.svg"
                alt="Hello Logo"
                width={120}
                height={44}
                priority
              />
            </a>
            <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-white	flex flex-wrap items-center text-base justify-center">
              <a className="mr-5 text-xl text-white">QR Code Generator</a>
            </nav>
            <div className="md:mr-auto	flex flex-wrap items-center text-base justify-center">
              <Image
                src="/playstrore.svg"
                alt="Play store Logo"
                width={200}
                height={80}
                priority
              />
            </div>
            <div className="inline-flex items-center  border-0 py-1 px-3 focus:outline-none h rounded text-base mt-4 md:mt-0">
              <a className="mr-5  text-xl text-white md:border-white-400 cursor-pointer" href="https://taptohello.com/login" target="_blank">
                Login
              </a>
              <a className="mr-5 text-xl text-white cursor-pointer" href="https://taptohello.com/register" target="_blank">Create Account</a>
            </div>
          </div>
        </header>
      </nav>
    </>
  );
};

export default Navbar;
