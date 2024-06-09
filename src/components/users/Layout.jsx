import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../../layout.css"; // Import your CSS file

const Layout = (props) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 1200);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1200);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleResize = () => {
    if (window.innerWidth >= 1200) {
      setIsSidebarVisible(true);
      setIsLargeScreen(true);
    } else {
      setIsSidebarVisible(false);
      setIsLargeScreen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="app">
      {isLargeScreen && <Sidebar isSidebarVisible={isSidebarVisible} />}
      {!isLargeScreen && <Sidebar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />}
      <div className={`overlay ${isSidebarVisible && !isLargeScreen ? "visible" : ""}`} onClick={toggleSidebar}></div>
      <main className={`content ${isLargeScreen ? "shifted" : ""}`}>
        <Navbar toggleSidebar={toggleSidebar} isLargeScreen={isLargeScreen} />
        {props.children}
      </main>
    </div>
  );
};

export default Layout;
