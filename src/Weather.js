import React, { Component } from 'react';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import './styles/Weather.css'

import WeatherTemperature from './WeatherTemperature'
import WeatherWeekly from './WeatherWeekly';

class Weather extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            currentLocation: "",
            weatherData: {},
            isSearchClicked: false,
            isSearching: false
        }

        // Binds
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gatherData = this.gatherData.bind(this);
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
            const query = `https://api.open-meteo.com/v1/forecast?latitude=${latLongResponse.latitude}&longitude=${latLongResponse.longitude}&hourly=temperature_2m`;
            const weatherResponse = await axios.get(query);
            const weatherData = weatherResponse.data;

            this.setState({ weatherData: weatherData, isSearchClicked: true, isSearching: false })
        }
        catch {
            console.log("Couldnt find data for: ", location)
            this.setState({ weatherData: {}, isSearchClicked: true, isSearching: false })
        }

    }

    render() {

        const { search, currentLocation, weatherData, isSearchClicked, isSearching } = this.state;

        // Today date to pass to child components
        const currentDay = new Date();
        let currentDayObj = {};
        currentDayObj.day = String(currentDay.getDate()).padStart(2, '0'); // Day
        if (currentDayObj.day[0] == "0") currentDayObj.day = currentDayObj.day.substring(1); // Day was 05 and we did 5
        currentDayObj.month = String(currentDay.getMonth() + 1).padStart(2, '0'); //January is 0!
        currentDayObj.year = currentDay.getFullYear(); // Year 
        currentDayObj.hour = currentDay.getHours(); // Current HOUR 


        return (
            <div className='Weather'>
                <h1 className='Weather-App-Logo'> Weather App </h1>
                <input id="searchInput" className='Weather-Search-Input' type="text" onChange={this.handleInput} />


                { // If something wrong in search we return error message
                    (isSearchClicked == true && Object.keys(weatherData).length == 0) ?
                        <p className="Weather-Search-Error"> I Couldn't find any data for city: {search} <br />
                            Make sure you haven't searched by country name or made any typing mistakes
                        </p>
                        : ""
                }

                <button className="Weather-Search-Button" onClick={this.handleSubmit}> Search </button>

                <p className="Weather-Search-City"> {search} </p>

                {// Loading Animation
                    (isSearching) ?
                        <div className="Weather-Loading-Container">
                            <div className='dot dot1'></div>
                            <div className='dot dot2'></div>
                            <div className='dot dot3'></div>
                            <div className='dot dot4'></div>
                        </div> : ""
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