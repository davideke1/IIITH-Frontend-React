import React from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "react-pro-sidebar/dist/css/styles.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import axiosService from "../../helpers/axios";

// Styled Components
const SidebarContainer = styled.div`
  .pro-sidebar {
    background: #282c34;
    height: 100vh;
    position: fixed;
  }

  .pro-menu-item {
    margin-bottom: 10px;
    color: #ffffff;
  }

  .pro-menu-item:hover {
    background: #3a3f47;
  }

  .pro-menu-item.active {
    background: #3a3f47;
  }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: 10px;
  background: #3a3f47;
  text-align: center;
  cursor: pointer;
  color: #ffffff;
  &:hover {
    background: #50575e;
  }
`;

const Sidebar = ({ isSidebarVisible }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (auth && auth.refresh) {
        const response = await axiosService.post("user-auth/logout/", {
          refresh: auth.refresh,
        });

        if (response.status === 204) {
          console.log("Logged out successfully");
          localStorage.removeItem("auth");
          navigate("/login"); // Redirect to login page after logout
        }
      } else {
        console.error("No refresh token found");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SidebarContainer className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
      <ProSidebar width="250px">
        <Menu iconShape="square">
          <MenuItem
            icon={<HomeOutlinedIcon />}
            onClick={() => navigate("/dashboard")}
            className="pro-menu-item"
          >
            Dashboard
            <Link to="/dashboard" />
          </MenuItem>
          <MenuItem
            icon={<PersonOutlinedIcon />}
            onClick={() => navigate("/profile")}
            className="pro-menu-item"
          >
            Profile
            <Link to="/profile" />
          </MenuItem>
          <MenuItem
            icon={<PasswordIcon />}
            onClick={() => navigate("/password-change")}
            className="pro-menu-item"
          >
            Password Change
            <Link to="/password-change" />
          </MenuItem>
          <MenuItem
            icon={<NotificationsNoneIcon />}
            onClick={() => navigate("/notifications")}
            className="pro-menu-item"
          >
            Notifications
            <Link to="/notifications" />
          </MenuItem>
          <MenuItem
            icon={<NotificationsNoneIcon />}
            onClick={() => navigate("/complains")}
            className="pro-menu-item"
          >
            Complaint
            <Link to="/complains" />
          </MenuItem>
          <MenuItem
            icon={<HistoryIcon />}
            onClick={() => navigate("/historydata")}
            className="pro-menu-item"
          >
            Historical Data
            <Link to="/historydata" />
          </MenuItem>
        </Menu>
        <SidebarFooter onClick={logout}>
          <LogoutIcon style={{ marginRight: "8px" }} />
          Logout
        </SidebarFooter>
      </ProSidebar>
    </SidebarContainer>
  );
};

export default Sidebar;
