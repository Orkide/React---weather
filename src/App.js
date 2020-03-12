import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import Typography from "@material-ui/core/Typography";
import MoodIcon from "@material-ui/icons/Mood";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import moment from "moment-timezone";
import React, { useState } from "react";
import Spinner from "react-spinner-material";
import "./App.css";

const api = {
  key: "bd71f79e3d9693c29385445464c0abdc",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [weather, setWeather] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullDate, setFullDate] = useState("");
  const [error, setError] = useState("");
  const [isDisconnected, setIsDisconnected] = useState(true);

  const handleConnectionChange = () => {
    const condition = navigator.onLine ? "online" : "offline";
  };

  const search = event => {
    if (event.key === "Enter") {
      setLoading(true);
      fetch(`${api.base}weather?q=${query}&appid=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery("");
          setLoading(false);
          if (result.name) {
            window.moment = moment;
            const country = moment.tz.zonesForCountry(result.sys.country);
            const date = moment().tz(country[0]);
            console.log(date);
            const FullDate = date.format("dddd, MMMM Do YYYY");
            setFullDate(FullDate);
          }
          document.title = `Weather of ${result.name}`;
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  };

  return (
    <>
      {error ? (
        <div className="internet-error">
          <p>{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div
          className={
            typeof weather.main != "undefined"
              ? weather.main.temp - 273.15 > 11
                ? "App warm"
                : "App"
              : "App"
          }
        >
          <div className="searchBox">
            <InputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              onChange={event => setQuery(event.target.value)}
              value={query}
              onKeyPress={search}
            />
          </div>
          <div className="loading">
            <Spinner
              radius={120}
              color={"#fff"}
              spinnerWidth={3}
              visible={true}
            />
          </div>
        </div>
      ) : (
        <div
          className={
            typeof weather.main != "undefined"
              ? weather.main.temp - 273.15 > 11
                ? "App warm"
                : "App"
              : "App"
          }
        >
          <div className="searchBox">
            <InputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
              onChange={event => setQuery(event.target.value)}
              value={query}
              onKeyPress={search}
            />
          </div>
          {typeof weather.main != "undefined" ? (
            <Grid
              className="container"
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <img
                  className="weatherIcon"
                  src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                  alt="Weather"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography className="location">
                  {weather.name}, {weather.sys.country}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className="date">{fullDate}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className="temp">
                  {Math.round(weather.main.temp - 273.15)} °C
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className="sitiuation">
                  {weather.weather[0].main}
                </Typography>
              </Grid>
            </Grid>
          ) : weather.message !== undefined ? (
            <Grid
              className="container"
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <SentimentVeryDissatisfiedIcon
                  className="dissatisfiedIcon"
                  fontSize="large"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography className="message"> {weather.message} </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <MoodIcon className="moodIcon" />
              </Grid>
              <Grid item xs={12}>
                <Typography className="message"> Welcome </Typography>
              </Grid>
            </Grid>
          )}
        </div>
      )}
    </>
  );
}

export default App;
