import { Box, Card, styled, CardMedia, Typography } from "@mui/material";
import React from "react";

const MoviesCard = ({ item }) => {
  const useStyles = styled({
    root: {
      maxWidth: 310,
      transition: "transform 0.15s ease-in-out",
    },
    cardHovered: {
      transform: "scale3d(1.05, 1.05, 1)",
    },
  });
  const classes = useStyles();
  const [state, setState] = React.useState({
    raised: false,
    shadow: 1,
  });
  return (
    <Card
      sx={{ margin: 2, width: 226 }}
      classes={{ root: state.raised ? classes.cardHovered : "" }}
      onMouseOver={() => setState({ raised: true, shadow: 3 })}
      onMouseOut={() => setState({ raised: false, shadow: 1 })}
      raised={state.raised}
      zdepth={state.shadow}
    >
      <Box position="relative">
        <CardMedia
          component="img"
          alt="green iguana"
          height="127.13px"
          image={item.image}
        />
        <Box sx={{ p: 1, backgroundColor: "#181818", color: "white" }}>
          <Typography
            sx={{
              fontFamily: "roboto",
              fontWeight: "bold",
              fontSize: "1.1em",
              fontStyle: "italic",
            }}
          >
            {item.name}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default MoviesCard;
