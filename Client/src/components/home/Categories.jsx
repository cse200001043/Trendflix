import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { menuItemClasses } from "@mui/base/MenuItem";
import { genreNames } from "../../shared/utils/data";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Grid } from "@mui/material";
import { connect } from "react-redux";
import { getMainActions } from "../../app/actions/mainActions";
import { useNavigate } from "react-router-dom";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    backgroundColor: "#191E25",
    minWidth: 400,
    maxWidth: 1500,
    color: "white",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: "#191E25",
      },
    },
  },
}));

const TriggerButton = styled(Button)(
  ({ theme }) => `
  font-family: Roboto;
  font-size: 1.4rem;
  font-weight: 100;
  margin-left: 25px;
  box-sizing: border-box;
  min-height: calc(1.5em + 25px);
  border-radius: 12px;
  padding: 0px 14px;
  line-height: 1.5;
  background: #00050D;
  border: 0px solid;
  color: #AAAAAA;

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    color: white;
  }
  `
);

const StyledMenuItem = styled(MenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  width: 100%;

  &:last-of-type {
    border-bottom: none;
  }

  &.${menuItemClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === "dark" ? "#0072E5" : "#99CCF3"};
    background-color: ${theme.palette.mode === "dark" ? "#32383f" : "#eaeef2"};
    color: ${theme.palette.mode === "dark" ? "#afb8c1" : "#24292f"};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? "#424a53" : "#8c959f"};
  }

  &:hover:not(.${menuItemClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? "#32383f" : "#eaeef2"};
    color: ${theme.palette.mode === "dark" ? "#afb8c1" : "#24292f"};
  }
  `
);

const CustomizedMenus = ({ searchGenre }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSubmit = (gen) => {
    const genre = {
      category: gen,
    };
    searchGenre(genre, navigate);
    setAnchorEl(null);
  };

  return (
    <div>
      <TriggerButton
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Categories
      </TriggerButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Grid container sx={{ p: 2 }}>
          <Grid item xs={12} md={3.5} sx={{ mx: 3 }}>
            <StyledMenuItem
              onClick={() => handleSubmit("top_rated")}
              style={{ justifyContent: "center" }}
            >
              Top Rated
            </StyledMenuItem>
          </Grid>
          <Grid item xs={12} md={3.5} sx={{ mx: 3 }}>
            <StyledMenuItem
              onClick={() => handleSubmit("popular")}
              style={{ justifyContent: "center" }}
            >
              Popular
            </StyledMenuItem>
          </Grid>
          {genreNames.map((gen, index) => (
            <Grid item xs={12} md={3.5} sx={{ mx: 3 }} key={index}>
              <StyledMenuItem
                onClick={() => handleSubmit(gen)}
                style={{ justifyContent: "center" }}
              >
                {gen}
              </StyledMenuItem>
            </Grid>
          ))}
        </Grid>
      </StyledMenu>
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getMainActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(CustomizedMenus);
