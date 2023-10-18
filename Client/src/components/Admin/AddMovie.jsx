import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Paper,
  Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  directorNames,
  writerNames,
  actorNames,
  genreNames,
  languageNames,
} from "../../shared/utils/data";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getAdminActions } from "../../app/actions/adminActions";
import { getActions } from "../../app/actions/alertActions";
import { CircularProgress } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const AddMovie = ({ addMovie, openAlertMessage }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [movieTitle, setMovieTitle] = useState("");
  const [director, setDirector] = useState("");
  const [otherDirectorValue, setOtherDirectorValue] = useState("");
  const [writer, setWriter] = useState("");
  const [trailer, setTrailer] = useState("");
  const [otherWriterValue, setOtherWriterValue] = useState("");
  const [rating, setRating] = useState("");
  const [aRated, setARated] = useState("");
  const [country, setCountry] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState(null);
  const [runTime, setRunTime] = useState(null);
  const [otherWriter, setOtherWriter] = useState(false);
  const [otherDirector, setOtherDirector] = useState(false);
  const [languages, setLanguages] = React.useState([]);
  const [genres, setGenres] = React.useState([]);
  const [imageUrls, setImageUrls] = useState({
    posterUrl: "",
    backgroundUrl: "",
  });
  const [selectedPosterImage, setSelectedPosterImage] = useState(null);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [actors, setActors] = useState([
    {
      actorName: "",
      authorName: "",
      character: "",
      selectedImage: null,
      imageUrl: "",
    },
  ]);
  const [actorUploadComplete, setActorUploadComplete] = useState(false);

  const handleActorChange = (index, field, value) => {
    const updatedActors = [...actors];
    updatedActors[index][field] = value;
    setActors(updatedActors);
  };

  const handleActorImageSelect = (index, selectedImage) => {
    const updatedActors = [...actors];
    updatedActors[index].selectedImage = selectedImage;
    setActors(updatedActors);
  };

  const handleActorImageDeselect = (index) => {
    const updatedActors = [...actors];
    updatedActors[index].selectedImage = null;
    setActors(updatedActors);
  };

  const removeActor = (index) => {
    const updatedActors = [...actors];
    updatedActors.splice(index, 1);
    setActors(updatedActors);
  };

  const addActor = () => {
    setActors([
      ...actors,
      {
        actorName: "",
        authorName: "",
        character: "",
        selectedImage: null,
        imageUrl: "",
      },
    ]);
  };

  const canAddActor = actors.every(
    (actor) => actor.actorName && actor.character
  );

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);
  };

  const handlePosterImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPosterImage({
          file,
          previewUrl: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedBackgroundImage({
          file,
          previewUrl: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePosterImageDeselect = () => {
    setSelectedPosterImage(null);
  };

  const handleBackgroundImageDeselect = () => {
    setSelectedBackgroundImage(null);
  };

  const uploadActorImagesToCloudinary = async () => {
    for (let i = 0; i < actors.length; i++) {
      const actor = actors[i];
      if (actor.selectedImage) {
        const data = new FormData();
        data.append("file", actor.selectedImage);
        data.append("upload_preset", "cinemania");
        data.append("cloud_name", "harshit9829");

        try {
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/harshit9829/image/upload",
            {
              method: "POST",
              body: data,
            }
          );

          if (response.ok) {
            const imageData = await response.json();
            const updatedActors = [...actors];
            updatedActors[i].imageUrl = imageData.url;
            setActors(updatedActors);
          } else {
            openAlertMessage("Image upload failed. Please try again!");
            setIsLoading(false);
            console.error("Image upload failed");
            return;
          }
        } catch (error) {
          openAlertMessage("Image upload failed. Please try again!");
          setIsLoading(false);
          console.error("Error uploading image:", error);
          return;
        }
      }
    }
    openAlertMessage("Poster Image upload complete.");
    setActorUploadComplete(true);
  };

  const uploadImagesToCloudinary = async (Uploadingfile, type) => {
    if (Uploadingfile) {
      const data = new FormData();
      data.append("file", Uploadingfile);
      data.append("upload_preset", "cinemania");
      data.append("cloud_name", "harshit9829");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/harshit9829/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        if (response.ok) {
          const imageData = await response.json();
          setImageUrls((prevImageUrls) => ({
            ...prevImageUrls,
            [type]: imageData.url,
          }));
          openAlertMessage("Poster Image upload complete.");
        } else {
          setIsLoading(false);
          openAlertMessage("Image upload failed. Please try again!");
          console.error("Image upload failed");

          return;
        }
      } catch (error) {
        setIsLoading(false);
        openAlertMessage("Image upload failed. Please try again!");
        console.error("Error uploading image:", error);
        return;
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedBackgroundImage && selectedPosterImage) {
      setIsLoading(true);
      uploadActorImagesToCloudinary();
      uploadImagesToCloudinary(selectedPosterImage.file, "posterUrl");
      uploadImagesToCloudinary(selectedBackgroundImage.file, "backgroundUrl");
    } else {
      openAlertMessage("Please fill all the details.");
    }
  };

  useEffect(() => {
    if (imageUrls.backgroundUrl !== "" && imageUrls.posterUrl !== "") {
      const modifiedActors = actors.map((actor) => {
        return {
          actorName:
            actor.actorName === "Other" ? actor.authorName : actor.actorName,
          character: actor.character,
          imageUrl: actor.imageUrl,
        };
      });
      const movieDetails = {
        movie_details: {
          movie_title: movieTitle,
          overview: description,
          genre: genres,
          release_date: releaseYear,
          runtime: parseFloat(runTime),
          director: otherDirector ? otherDirectorValue : director,
          writer: otherWriter ? otherWriterValue : writer,
          cast: modifiedActors,
          tagline: tagline,
          poster_image: imageUrls.posterUrl,
          background_image: imageUrls.backgroundUrl,
          language: languages,
          country: country,
          rating: parseFloat(rating),
          A_rated: aRated,
          trailer: trailer,
          count: 0,
        },
      };
      if (
        imageUrls.backgroundUrl !== "" &&
        imageUrls.posterUrl !== "" &&
        actorUploadComplete &&
        isLoading
      ) {
        addMovie(movieDetails, navigate, setIsLoading);
      }
    }
  }, [imageUrls, setActorUploadComplete, actorUploadComplete]);

  return (
    <>
      <Box sx={{ backgroundColor: "black" }}>
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              my: 5,
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
              Please Enter Movie Details
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <input
                        accept="image/*"
                        id="movie-poster-upload"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handlePosterImageSelect}
                      />
                      <label htmlFor="movie-poster-upload">
                        <Paper
                          elevation={3}
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          component="div"
                        >
                          {selectedPosterImage ? (
                            <div>
                              <img
                                src={selectedPosterImage.previewUrl}
                                alt="Movie Poster"
                                style={{ maxWidth: "100%", maxHeight: "200px" }}
                              />
                              <Typography variant="caption">
                                {selectedPosterImage.file.name}
                              </Typography>
                              <IconButton
                                color="error"
                                aria-label="Deselect"
                                onClick={handlePosterImageDeselect}
                              >
                                <CancelIcon />
                              </IconButton>
                            </div>
                          ) : (
                            <Typography variant="body1">
                              Select a Movie Poster
                            </Typography>
                          )}
                        </Paper>
                      </label>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        accept="image/*"
                        id="movie-background-upload"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleBackgroundImageSelect}
                      />
                      <label htmlFor="movie-background-upload">
                        <Paper
                          elevation={3}
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          component="div"
                        >
                          {selectedBackgroundImage ? (
                            <div>
                              <img
                                src={selectedBackgroundImage.previewUrl}
                                alt="Movie Poster"
                                style={{ maxWidth: "100%", maxHeight: "200px" }}
                              />
                              <Typography variant="caption">
                                {selectedBackgroundImage.file.name}
                              </Typography>
                              <IconButton
                                color="error"
                                aria-label="Deselect"
                                onClick={handleBackgroundImageDeselect}
                              >
                                <CancelIcon />
                              </IconButton>
                            </div>
                          ) : (
                            <Typography variant="body1">
                              Select a Movie Background
                            </Typography>
                          )}
                        </Paper>
                      </label>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        id="movieTitle"
                        label="Movie Title"
                        type="text"
                        name="movieTitle"
                        autoComplete="Movie Title"
                        onChange={(e) => setMovieTitle(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        id="releaseYear"
                        label="Release Year"
                        type="number"
                        name="releaseYear"
                        autoComplete="Release Year"
                        onChange={(e) => setReleaseYear(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        id="runTime"
                        label="Run Time (Minutes)"
                        type="number"
                        name="runTime"
                        autoComplete="Run Time"
                        onChange={(e) => setRunTime(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        id="country"
                        label="Country"
                        type="text"
                        name="country"
                        autoComplete="Country"
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    id="description"
                    label="Description"
                    type="text"
                    name="description"
                    autoComplete="Description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{ fontSize: "0.9em", p: 0, backgroundColor: "#007791" }}
                    onClick={() => setOpen(true)}
                  >
                    Add Cast
                  </Button>
                </Grid>

                {/* Hello */}
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Box
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        px: 2,
                        py: 1,
                      }}
                      id="modal-modal-title"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h6" component="h2">
                          Add Cast
                        </Typography>
                        <div>
                          <IconButton
                            sx={{ color: "white" }}
                            aria-label="Delete"
                            onClick={handleClose}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      </div>
                    </Box>
                    <Box sx={{ maxHeight: "500px", p: 5, overflowY: "auto" }}>
                      {actors.map((actor, index) => (
                        <Box
                          key={index}
                          sx={{
                            maxWidth: "1000px",
                            mt: index !== 0 ? 2 : 0,
                            display: "flex",
                          }}
                        >
                          <Grid
                            container
                            sx={{ border: "0.1px solid #C0C0C0", p: 2 }}
                          >
                            <Grid item xs={12} md={7} sx={{ mr: 4 }}>
                              <Grid container spacing={1}>
                                <Grid item xs={12}>
                                  <Autocomplete
                                    required
                                    disablePortal
                                    options={actorNames}
                                    value={actor.actorName}
                                    onChange={(e, val) => {
                                      handleActorChange(
                                        index,
                                        "actorName",
                                        val
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Actor Name"
                                      />
                                    )}
                                  />
                                </Grid>
                                {actor.actorName === "Other" && (
                                  <Grid item xs={12}>
                                    <TextField
                                      required
                                      fullWidth
                                      id="author"
                                      label="Author Name"
                                      type="text"
                                      name="authorName"
                                      value={actor.authorName}
                                      onChange={(e) => {
                                        handleActorChange(
                                          index,
                                          "authorName",
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </Grid>
                                )}
                                <Grid item xs={12}>
                                  <TextField
                                    required
                                    fullWidth
                                    id="character"
                                    label="Character"
                                    type="text"
                                    name="character"
                                    value={actor.character}
                                    onChange={(e) => {
                                      handleActorChange(
                                        index,
                                        "character",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <input
                                accept="image/*"
                                id={`actor-upload-${index}`}
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const selectedImage = e.target.files[0];
                                  handleActorImageSelect(index, selectedImage);
                                }}
                              />
                              <label htmlFor={`actor-upload-${index}`}>
                                <Paper
                                  elevation={3}
                                  style={{
                                    padding: "15px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                  }}
                                  component="div"
                                >
                                  {actor.selectedImage ? (
                                    <div>
                                      <img
                                        src={URL.createObjectURL(
                                          actor.selectedImage
                                        )}
                                        alt="Actor"
                                        style={{
                                          maxWidth: "100%",
                                          maxHeight: "80px",
                                        }}
                                      />
                                      <br />
                                      <IconButton
                                        color="error"
                                        aria-label="Deselect"
                                        onClick={() =>
                                          handleActorImageDeselect(index)
                                        }
                                        sx={{ p: 0 }}
                                      >
                                        <CancelIcon
                                          sx={{ fontSize: "0.8em", p: 0 }}
                                        />
                                      </IconButton>
                                    </div>
                                  ) : (
                                    <Typography variant="body1">
                                      Select an Actor Image
                                    </Typography>
                                  )}
                                </Paper>
                              </label>
                            </Grid>
                          </Grid>
                          <IconButton
                            aria-label="remove"
                            onClick={() => removeActor(index)}
                            sx={{ ml: 1, ":hover": { borderRadius: "0%" } }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <IconButton
                        aria-label="add"
                        onClick={addActor}
                        disabled={!canAddActor}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Modal>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Autocomplete
                        required
                        disablePortal
                        id="director"
                        options={directorNames}
                        value={director}
                        onChange={(e, val) => {
                          if (val === "Other") {
                            setOtherDirector(true);
                          } else {
                            setOtherDirector(false);
                          }
                          setDirector(val);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Director" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        required
                        disablePortal
                        id="writer"
                        options={writerNames}
                        value={writer}
                        onChange={(e, val) => {
                          if (val === "Other") {
                            setOtherWriter(true);
                          } else {
                            setOtherWriter(false);
                          }
                          setWriter(val);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Writer" />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: otherDirector || otherWriter ? "auto" : "none",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        sx={{ display: otherDirector ? "auto" : "none" }}
                        required
                        fullWidth
                        id="otherDirector"
                        label="Other Director"
                        type="text"
                        name="otherDirector"
                        autoComplete="Other Director"
                        onChange={(e) => setOtherDirectorValue(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{ display: otherWriter ? "auto" : "none" }}
                        required
                        fullWidth
                        id="otherWriter"
                        label="Other Writer"
                        type="number"
                        name="otherWriter"
                        autoComplete="Other Writer"
                        onChange={(e) => setOtherWriterValue(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        id="rating"
                        label="Rating (out of 10)"
                        type="text"
                        name="rating"
                        autoComplete="Rating"
                        onChange={(e) => setRating(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel>A Rated</InputLabel>
                        <Select
                          required
                          label="A Rated"
                          value={aRated}
                          onChange={(e) => setARated(e.target.value)}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="tagline"
                    label="TagLine"
                    type="text"
                    name="tagline"
                    autoComplete="Writer"
                    onChange={(e) => setTagline(e.target.value)}
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
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="trailer"
                    label="Trailer Link"
                    type="text"
                    name="trailer"
                    autoComplete="Trailer"
                    onChange={(e) => setTrailer(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {!isLoading
                  ? "Submit Details"
                  : "Adding new movie. Please wait"}
                {!isLoading ? (
                  <></>
                ) : (
                  <CircularProgress
                    color="secondary"
                    size={25}
                    sx={{ ml: 2 }}
                  />
                )}
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
    ...getAdminActions(dispatch),
    ...getActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(AddMovie);
