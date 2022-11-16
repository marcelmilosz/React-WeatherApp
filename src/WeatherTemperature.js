import React, { Component } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import rainIcon from './icons/rain.png'
import snowIcon from './icons/snow.png'
import sunCloudsIcon from './icons/sun-clouds.png'
import sunIcon from './icons/sun.png'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faAnglesDown } from '@fortawesome/free-solid-svg-icons'

import './styles/WeatherTemperature.css'

class WeatherTemperature extends Component {
    constructor(props) {
        super(props);

        this.getIcon = this.getIcon.bind(this);
    }


    // This function decides what icon to display 
    getIcon(temperature) {

        if (temperature < 2) return snowIcon
        else if (temperature < 5) return rainIcon
        else if (temperature < 15) return sunCloudsIcon
        else return sunIcon

    }

    render() {

        const { temperature_2m, time } = this.props['temperatureData'];
        const { todayDate } = this.props;

        // number indicates how many temperatures we want (1 = 1 temperature in 1 hour)
        const MaxAmoutOfData = Math.min(50, temperature_2m.length)

        // Get time and temperature data from props
        let tempAndTime = [];
        for (let i = 0; i < MaxAmoutOfData; i++) {
            let dateFormat = new Date(time[i])

            let temp = Math.floor(temperature_2m[i]);

            let time_h = format(dateFormat, "H"); // Hours 0 -> 23
            if (time_h == "0") time_h = "24" // turn 0 to 24 so we have 1 -> 24

            let whatDayPhase = format(dateFormat, "p") // 12:00 AM or PM 

            let isDay = (whatDayPhase.includes("AM") ? true : false);
            let time_day = format(dateFormat, "d"); // Days

            let tmp = { temp: temp, time_h: parseInt(time_h), time_day: time_day, isDay: isDay };

            tempAndTime.push(tmp);
        }

        const tempAndTimeEle = tempAndTime.map(ele => {
            return (
                <div key={uuidv4()} className={(todayDate.hour == ele.time_h && ele.time_day == todayDate.day) ? "current-hour-container " : 'single-temperature-container '}>
                    <p className='time-h'> {ele.time_h} </p>
                    <img className="temperature-icon" src={this.getIcon(ele.temp)} />
                    <p className={(ele.time_h > 6 && ele.time_h < 21) ? "hours-day" : "hours-night" + " temperature"}> {ele.temp}° </p>
                </div >
            )
        })





        return (
            <div className='WeatherTemperature' >
                {tempAndTimeEle}
            </div>
        );
    }
}

export default WeatherTemperature;