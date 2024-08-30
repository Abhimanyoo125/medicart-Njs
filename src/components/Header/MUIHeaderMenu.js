"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Button from '../Reusable/Button';
import { HeaderMenuOptions } from '@/constants/index';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Box, Button as MuiButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';

export default function MUIHeaderMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuToggle = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(!menuOpen);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{backgroundColor: 'secondary.main', color: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <IconButton edge="start" color="inherit" aria-label="logo">
          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.6667 6.99998C23.2123 6.99998 21.2223 8.98998 21.2223 11.4444C21.2223 13.2689 22.3228 14.8322 23.8951 15.5172V19.8894C23.8951 23.07 21.1034 25.6672 17.6728 25.6672C14.3395 25.6672 11.6006 23.2172 11.4562 20.1544C15.4501 19.3222 18.5556 15.7389 18.5556 11.3944V2.81054C18.5556 2.17831 18.1028 1.62276 17.4845 1.50498L13.9889 0.804286C13.2667 0.658453 12.5701 1.12462 12.4245 1.84706L12.2445 2.72165C12.0987 3.44387 12.5674 4.14331 13.2895 4.28942L14.9945 4.62604V11.3722C14.9945 14.31 12.6539 16.7405 9.7095 16.7683C6.74394 16.7961 4.33117 14.4039 4.33117 11.4389L4.32728 4.63165L6.03394 4.29209C6.75617 4.1532 7.22339 3.45043 7.07728 2.7282L6.90561 1.85387C6.76672 1.13165 6.06394 0.664425 5.34172 0.810536L1.84894 1.49942C1.23061 1.62442 0.777832 2.17165 0.777832 2.81054V11.4439C0.777832 15.7355 3.8395 19.3328 7.8945 20.155C8.03894 25.1833 12.3667 29.2222 17.6667 29.2222C23.0556 29.2222 27.4445 25.035 27.4445 19.8889V15.5166C29.0128 14.83 30.1112 13.2689 30.1112 11.4472C30.1112 8.98887 28.1223 6.99998 25.6667 6.99998ZM25.6667 12.7778C24.9306 12.7778 24.3334 12.1805 24.3334 11.4444C24.3334 10.7083 24.9278 10.1111 25.6667 10.1111C26.4056 10.1111 27.0001 10.7055 27.0001 11.4444C27.0001 12.1833 26.4056 12.7778 25.6667 12.7778Z" fill="#212121"/>
          </svg>
        </IconButton>

        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          aria-label="open menu"
          onClick={handleMenuToggle}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Header Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, ml: 4,  }}>
          {HeaderMenuOptions.map((option) => (
            <MuiButton sx={{'&:hover': { 
            color: 'tertiary.main', 
            cursor: 'pointer'
          }}} key={option.key} color="inherit">
              {option.label}
            </MuiButton>
          ))}
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, }}>
          <IconButton color="inherit" 
             sx={{
              '&:hover': {
                color: 'tertiary.main', // color on hover
              },
            }}
          >
            <ShoppingCartIcon />
          </IconButton>
          <IconButton color="inherit"
            sx={{
              '&:hover': {
                color: 'tertiary.main', // color on hover
              },
            }}
          >
            <PersonIcon />
          </IconButton>
        </Box>

        
      </Toolbar>
    </AppBar>
  );
}
