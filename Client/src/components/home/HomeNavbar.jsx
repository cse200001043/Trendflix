import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Categories from "./Categories";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Logout } from "../../shared/utils/Logout";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { connect, useSelector } from "react-redux";
import { getMainActions } from "../../app/actions/mainActions";
import { getAuthActions } from "../../app/actions/authActions";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(5),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "50ch",
    },
  },
}));

const PrimarySearchAppBar = ({ userDetails, searchMovie }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const user = useSelector((state) => state.auth.userDetails);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("API call with searchValue:", searchValue);
      const movieName = {
        movie_name: searchValue,
      };
      searchMovie(movieName, navigate);
      setSearchValue("");
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user?.role === "admin" ? (
        <></>
      ) : (
        <MenuItem sx={{ my: -2 }} onClick={() => navigate("/favourites")}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <FavoriteBorderIcon />
          </IconButton>
          <p>Liked Movies</p>
        </MenuItem>
      )}
      <MenuItem sx={{ my: -1 }} onClick={Logout}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <LogoutIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <FavoriteBorderIcon />
        </IconButton>
        <p>Liked Movies</p>
      </MenuItem>
      <MenuItem onClick={Logout}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <LogoutIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#00050D" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => navigate("/")}
            aria-label="open drawer"
            sx={{ mr: 2, ml: 13 }}
          >
            <VideoCameraBackIcon sx={{ fontSize: "1.2em" }} />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            onClick={() => navigate("/")}
            sx={{
              display: { xs: "none", sm: "block", fontFamily: "Roboto" },
              cursor: "pointer",
            }}
          >
            CineMania
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Search>
          <Box>
            <Categories />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {userDetails ? (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                onClick={handleProfileMenuOpen}
                aria-haspopup="true"
                color="inherit"
                sx={{ mr: 13, ml: 2 }}
              >
                <AccountCircle sx={{ fontSize: "1.2em" }} />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="black"
                variant="container"
                onClick={() => {
                  navigate("/register");
                }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block", fontFamily: "Roboto" },
                  }}
                >
                  Register
                </Typography>
              </Button>
              <Button
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="black"
                sx={{ mr: 13 }}
                variant="container"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block", fontFamily: "Roboto" },
                  }}
                >
                  Login
                </Typography>
              </Button>
            </Box>
          )}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
        {renderMenu}
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
};

const mapStoreStateToProps = ({ auth }) => {
  return {
    ...auth,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getMainActions(dispatch),
    ...getAuthActions(dispatch),
  };
};
export default connect(
  mapStoreStateToProps,
  mapActionsToProps
)(PrimarySearchAppBar);
