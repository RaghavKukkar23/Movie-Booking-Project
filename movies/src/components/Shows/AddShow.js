import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormLabel,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { addShow, getAllMovies , getAllTheaters } from "../../api-helpers/api-helpers";

const labelProps = {
  mt: 1,
  mb: 1,
};

const AddShow = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [inputs, setInputs] = useState({
    movie: "",
    theater: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    // Fetch available movies and theaters
    Promise.all([getAllMovies(), getAllTheaters()])
      .then(([moviesRes, theatersRes]) => {
        setMovies(moviesRes.movies || []);
        setTheaters(theatersRes.theaters || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputs.movie || !inputs.theater || !inputs.startTime || !inputs.endTime) {
      toast.error("Please fill out all fields!");
      return;
    }

    addShow(inputs)
      .then((res) => {
        toast.success("Show Added Successfully");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add show");
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          width={"50%"}
          padding={10}
          margin="auto"
          display={"flex"}
          flexDirection="column"
          boxShadow={"10px 10px 20px #ccc"}
        >
          <Typography
            textAlign={"center"}
            variant="h5"
            fontFamily={"verdana"}
          >
            Add New Show
          </Typography>
          <FormLabel sx={labelProps}>Select Movie</FormLabel>
          <Select
            value={inputs.movie}
            name="movie"
            onChange={handleChange}
            variant="standard"
            margin="normal"
          >
            {movies.map((movie) => (
              <MenuItem key={movie._id} value={movie._id}>
                {movie.title}
              </MenuItem>
            ))}
          </Select>

          <FormLabel sx={labelProps}>Select Theater</FormLabel>
          <Select
            value={inputs.theater}
            name="theater"
            onChange={handleChange}
            variant="standard"
            margin="normal"
          >
            {theaters.map((theater) => (
              <MenuItem key={theater._id} value={theater._id}>
                {theater.name}
              </MenuItem>
            ))}
          </Select>

          <FormLabel sx={labelProps}>Start Time</FormLabel>
          <TextField
            type="datetime-local"
            value={inputs.startTime}
            onChange={handleChange}
            name="startTime"
            variant="standard"
            margin="normal"
          />

          <FormLabel sx={labelProps}>End Time</FormLabel>
          <TextField
            type="datetime-local"
            value={inputs.endTime}
            onChange={handleChange}
            name="endTime"
            variant="standard"
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "30%",
              margin: "auto",
              bgcolor: "#2b2d42",
              ":hover": {
                bgcolor: "#121217",
              },
            }}
          >
            Add Show
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AddShow;