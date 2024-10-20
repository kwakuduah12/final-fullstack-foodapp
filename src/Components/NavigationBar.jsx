import React, { useState } from "react";
import Logo from "../Assets/logo.svg";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import SearchIcon from "@mui/icons-material/Search"; // Importing Search icon

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
    },
    {
      text: "Stores",
      icon: <StoreIcon />,
    },
    {
      text: "Search",
      icon: <SearchIcon />, 
    },
    {
      text: "Cart",
      icon: <ShoppingCartRoundedIcon />, 
    },
    {
      text: "Profile",
      icon: <CommentRoundedIcon />,
    },
  ];
  
  return (
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="Logo" />
        <span className="logo-text">HomeDasher</span>
      </div>
      <div className="navbar-links-container">
        {menuOptions.map((item) => (
          <a href="Icon" key={item.text}>
            {item.icon}
            {item.text}
            
          </a>
        ))}
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;