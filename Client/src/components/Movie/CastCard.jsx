import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  styled,
} from "@mui/material";
import React from "react";

const CastCard = ({ actor }) => {
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
    <Box
      sx={{
        cursor: "pointer",
        m: 2.5,
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Card
        sx={{ width: 150 }}
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
            height="175"
            image={actor.image}
          />
          <CardContent style={{ padding: "12px 0 0 0", height: "80px" }}>
            <Typography
              variant="h6"
              align="center"
              sx={{ fontSize: "1.1em", fontWeight: "bold" }}
            >
              {actor.name}
            </Typography>
            <Typography variant="h6" align="center" sx={{ fontSize: "0.9em" }}>
              {actor.character}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default CastCard;
