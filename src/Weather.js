import React, { Component } from 'react';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import './styles/Weather.css'

import WeatherTemperature from './WeatherTemperature'
import WeatherWeekly from './WeatherWeekly';
import WeatherCurrent from './WeatherCurrent';
import WeatherPressure from './WeatherPressure';

import rainIcon from './icons/rain.png'
import snowIcon from './icons/snow.png'
import sunCloudsIcon from './icons/sun-clouds.png'
import sunIcon from './icons/sun.png'

class Weather extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            currentLocation: "",
            weatherData: {},
            isSearchClicked: false,
            isSearching: false,
            currentTemperature: 0
        }

        // Binds
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gatherData = this.gatherData.bind(this);
        this.getIcon = this.getIcon.bind(this);
    }

    componentDidMount() {
        // console.log("Component mounted!")
    }

    componentDidUpdate() {
        // console.log("Component Updated!")
    }

    componentWillUnmount() {
        // console.log("Component Unmounted");
    }

    // It updates currentLocation from input 
    handleInput(e) {
        this.setState({ currentLocation: e.target.value });
    }

    // Here we handle button click, we get currentLoation from input and then we asign Search => currentLocation and them we reset currentLocation
    handleSubmit(e) {
        let prevState = { ...this.state };

        prevState["search"] = prevState["currentLocation"];
        prevState["currentLocation"] = "";
        document.getElementById("searchInput").value = "";
        prevState["dataFound"] = 0;
        prevState["isSearchClicked"] = false;
        prevState["isSearching"] = true;

        this.gatherData(prevState["search"]);

        this.setState({ ...prevState })
    }

    // Getting latLong info and temperature data from this location
    async gatherData(location) {

        console.log("Getting data for: ", location);

        try {
            const config = {
                headers: {
                    'X-Api-Key': "o/vTyYhN9jukETYOvwpNGg==PJHhFBlsXVy7F4EQ"
                }
            }

            // Get Latitude and longitude
            const latLong = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${location}`, config);
            // const latLong = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=Warsaw`, config);
            const latLongResponse = latLong.data[0];


            // Get temperature of this city:
            const query = `https://api.open-meteo.com/v1/forecast?latitude=${latLongResponse.latitude}&longitude=${latLongResponse.longitude}&hourly=temperature_2m,pressure_msl,surface_pressure`;

            const weatherResponse = await axios.get(query);
            const weatherData = weatherResponse.data;

            this.setState({ weatherData: weatherData, isSearchClicked: true, isSearching: false })
        }
        catch {
            console.log("Couldnt find data for: ", location)
            this.setState({ weatherData: {}, isSearchClicked: true, isSearching: false })
        }

    }

    getIcon(temperature) {

        if (temperature < 2) return snowIcon
        else if (temperature < 5) return rainIcon
        else if (temperature < 15) return sunCloudsIcon
        else return sunIcon

    }

    // We calculate current temperature and we pass it to the WeatherCurrent component
    getCurrentTemperature(data, currentDay) {
        let dates = data.hourly.time;
        let i = 0;
        let currentTemperature = []; // Temperature, ICON 

        while (true) {
            let cDate = new Date(dates[i]);
            let cDay = String(cDate.getDate());
            let cMonth = String(cDate.getMonth() + 1);
            let cHour = cDate.getHours();
            // console.log(dates, currentDay)
            // console.log(cDate)
            // console.log(currentDay)
            // console.log(cDay, cMonth, cHour)

            if (currentDay.day === cDay && currentDay.month === cMonth && currentDay.hour === cHour) {
                break;
            }

            if (i > 24) return 0;

            i++;
        }
        currentTemperature.push(Math.floor(data.hourly.temperature_2m[i]));
        currentTemperature.push(this.getIcon(currentTemperature[0]));

        // console.log(currentTemperature)

        return currentTemperature
    }

    // We calculate Pressure by adding 24 points together and getting the mean value
    getCurrentPressure(data) {
        let tmpSum = 0;
        for (let i = 0; i < 24; i++) {
            tmpSum += data[i]
        }

        return (tmpSum / 24)
    }

    render() {

        const { search, weatherData, isSearchClicked, isSearching } = this.state;
        let currentTemperaute = 0;
        let currentPressure = 0;

        // Today date to pass to child components
        const currentDay = new Date();
        let currentDayObj = {};
        currentDayObj.day = String(currentDay.getDate()).padStart(2, '0'); // Day
        if (currentDayObj.day[0] === "0") currentDayObj.day = currentDayObj.day.substring(1); // Day was 05 and we did 5
        currentDayObj.month = String(currentDay.getMonth() + 1).padStart(2, '0'); //January is 0!
        currentDayObj.year = currentDay.getFullYear(); // Year 
        currentDayObj.hour = currentDay.getHours(); // Current HOUR 

        if (Object.keys(weatherData).length > 0) {
            currentTemperaute = this.getCurrentTemperature(weatherData, currentDayObj);
            currentPressure = this.getCurrentPressure(weatherData.hourly.pressure_msl);
        }


        return (
            <div className='Weather'>
                <h1 className='Weather-App-Logo'> Weather App </h1>
                <input id="searchInput" className='Weather-Search-Input' type="text" onChange={this.handleInput} />


                { // If something wrong in search we return error message
                    (isSearchClicked === true && Object.keys(weatherData).length === 0) ?
                        <p className="Weather-Search-Error"> I Couldn't find any data for city: {search} <br />
                            Make sure you haven't searched by country name or made any typing mistakes
                        </p>
                        : ""
                }

                <button className="Weather-Search-Button" onClick={this.handleSubmit}> Search </button>

                <div class="Weather-Search-Box">
                    <p className="Weather-Search-City"> Location: {search} </p>
                </div>


                {// Loading Animation
                    (isSearching) ?
                        <div className="Weather-Loading-Container">
                            <div className='dot dot1'></div>
                            <div className='dot dot2'></div>
                            <div className='dot dot3'></div>
                            <div className='dot dot4'></div>
                        </div> : ""
                }

                { // Here we are loading Current temperature and Location
                    (Object.keys(weatherData).length !== 0) ?
                        <div className='Weather-Double-Box'>
                            <WeatherCurrent key={uuidv4()} currentTemperature={currentTemperaute} />
                            <WeatherPressure key={uuidv4()} currentPressure={currentPressure} />
                        </div>
                        : ""
                }

                { // Here we are loading Daily temperature 
                    (Object.keys(weatherData).length !== 0) ?
                        <WeatherTemperature key={uuidv4()} temperatureData={weatherData.hourly} todayDate={currentDayObj} /> : ""
                }

                { // Here we are loading Weekly temperature info 
                    (Object.keys(weatherData).length !== 0) ?
                        <WeatherWeekly key={uuidv4()} temperatureData={weatherData.hourly} todayDate={currentDayObj} /> : ""
                }



            </div>
        );
    }
}

export default Weather;