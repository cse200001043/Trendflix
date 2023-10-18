import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { languageNames, genreNames } from "../shared/utils/data";
import { getMainActions } from "../app/actions/mainActions";
import { useNavigate } from "react-router-dom";
import { store } from "..";

const InitialDetails = ({ addInitialDetails }) => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [languages, setLanguages] = React.useState([]);
  const [genres, setGenres] = React.useState([]);
  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleSubmit = (event) => {
    console.log("store.getState();", store.getState());
    event.preventDefault();
    const userDetails = {
      age,
      country,
      languages,
      genres,
    };
    console.log("userDetails", userDetails);
    addInitialDetails(userDetails, navigate);
  };

  return (
    <>
      <Box sx={{ backgroundColor: "black", height: "100vh" }}>
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              mt: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              padding: 4,
              borderRadius: 1,
              boxShadow: 5,
            }}
          >
            <Typography component="h1" variant="h5">
              Please Enter Your Details
            </Typography>
            <Box
              component="form"
              noValidate
              // onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="age"
                    label="Age"
                    type="number"
                    name="age"
                    autoComplete="age"
                    onChange={handleAgeChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="country"
                    label="Your Country"
                    type="text"
                    name="country"
                    autoComplete="country"
                    onChange={handleCountryChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="languages"
                    value={languages}
                    onChange={(event, newValue) => {
                      setLanguages(newValue);
                    }}
                    options={languageNames}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Languages"
                        placeholder="Add Your Language"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    value={genres}
                    onChange={(event, newValue) => {
                      setGenres(newValue);
                    }}
                    options={genreNames}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Genres"
                        placeholder="Add Favourite Genre"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Submit Details
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getMainActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(InitialDetails);
