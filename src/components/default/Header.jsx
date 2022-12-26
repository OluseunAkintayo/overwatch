import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { MenuOpen, Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menu, setMenu] = React.useState(null);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const openMenu = (event) => setMenu(event.currentTarget);
  
  const [productMenuAnchor, setProductMenuAnchor] = React.useState(null);
  const openProductMenu = (event) => setProductMenuAnchor(event.target);
  const [storeMenuAnchor, setStoreMenuAnchor] = React.useState(null);
  const openStoreMenu = (event) => setStoreMenuAnchor(event.target);
  
  const handleClose = () => {
    setAnchorEl(null);
    setMenu(null);
    setProductMenuAnchor(null);
    setStoreMenuAnchor(null);
  };
  const logout = () => {
    setAnchorEl(null);
    setMenu(null);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth/login");
  }

  const itemStyle = { fontFamily: "'Mulish', sans-serif" };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingRight: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '', cursor: 'pointer' }}>
            <Visibility />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>VERWATCH</Typography>
          </Box>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={openMenu}
                color="inherit"
              >
                <MenuOpen />
              </IconButton>
              <Menu
                sx={{ mt: '36px' }}
                keepMounted
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem sx={itemStyle} onClick={handleClose}>Profile</MenuItem>
                <MenuItem sx={itemStyle} onClick={logout}>Logout</MenuItem>
              </Menu>
              <Menu
                sx={{ mt: '36px' }}
                keepMounted
                anchorEl={menu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(menu)}
                onClose={handleClose}
              >
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/"); }}>Home</MenuItem>
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/shop") }}>Shop</MenuItem>
                <MenuItem sx={itemStyle} onClick={openProductMenu}>Products</MenuItem>
                <MenuItem sx={itemStyle} onClick={openStoreMenu}>Store</MenuItem>
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/reporting"); }}>Reporting</MenuItem>
              </Menu>
              <Menu
                sx={{ mt: '8px' }}
                keepMounted
                anchorEl={productMenuAnchor}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(productMenuAnchor)}
                onClose={handleClose}
              >
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/products"); }}>Products</MenuItem>
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/products/brands"); }}>Brands</MenuItem>
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/products/categories"); }}>Categories</MenuItem>
              </Menu>
              <Menu
                sx={{ mt: '8px' }}
                keepMounted
                anchorEl={storeMenuAnchor}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(storeMenuAnchor)}
                onClose={handleClose}
              >
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/store"); }}>Store</MenuItem>
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/store/vendors"); }}>Suppliers</MenuItem>
                <MenuItem sx={itemStyle} onClick={() => { handleClose(); navigate("/store/new-supply") }}>New Supply</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
