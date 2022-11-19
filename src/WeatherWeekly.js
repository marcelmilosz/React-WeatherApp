import React, { Component } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import './styles/WeatherWeekly.css'

import rainIcon from './icons/rain.png'
import snowIcon from './icons/snow.png'
import sunCloudsIcon from './icons/sun-clouds.png'
import sunIcon from './icons/sun.png'

class WeatherWeekly extends Component {

    combineTemperatueAndTime(temperature_2m, time) {
        let combinedArr = []

        for (let i = 0; i < time.length; i++) {
            let dateFormat = new Date(time[i])

            let temp = Math.floor(temperature_2m[i]);

            let time_h = format(dateFormat, "H"); // Hours 0 -> 23
            if (time_h === "0") time_h = "24" // turn 0 to 24 so we have 1 -> 24

            let whatDayPhase = format(dateFormat, "p") // 12:00 AM or PM 

            let isDay = (whatDayPhase.includes("AM") ? true : false);
            let time_day = format(dateFormat, "d"); // Days

            let tmp = { temp: temp, time_h: parseInt(time_h), time_day: time_day, isDay: isDay };

            combinedArr.push(tmp);
        }

        return combinedArr
    }

    getMinMaxMeanByDay(tempAndTime) {
        // Here we gather data by One full day so we can get info about (day max temp etc)
        let tempAndTimeByDay = [[]];

        let dailyHighs = []; // Max Min temperature in a day 
        let dailyLows = [];
        let dailyMean = [];

        let mean = 0;
        let maxTemp = -200;
        let minTemp = 200;

        let tempIndex = 0;

        for (let i = 0; i < tempAndTime.length; i++) {
            if (i !== 0 && i % 24 === 0) {
                tempAndTimeByDay.push([]);
                tempIndex++;

                dailyHighs.push(maxTemp);
                dailyLows.push(minTemp);
                dailyMean.push(Math.floor(mean / 24));

                maxTemp = -200;
                minTemp = 200;
                mean = 0;
            }

            mean += tempAndTime[i].temp;
            tempAndTimeByDay[tempIndex].push(tempAndTime[i]);

            if (tempAndTime[i].temp > maxTemp) maxTemp = tempAndTime[i].temp;
            if (tempAndTime[i].temp < minTemp) minTemp = tempAndTime[i].temp;

        }

        dailyHighs.push(maxTemp);
        dailyLows.push(minTemp);
        dailyMean.push(Math.floor(mean / 24));

        return [dailyHighs, dailyLows, dailyMean]
    }

    // We get next 6 days (names) starting from today etc. today is Monday so we get [Mondey, Tuesdey..]
    getNextDaysFromToday() {

        let currentDate = new Date();
        let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let weekDaysInOrder = [];
        let startingIndex = currentDate.getDay();


        for (let i = 0; i < weekdays.length; i++) {
            if (startingIndex === weekdays.length) {
                startingIndex = 0;
            }
            weekDaysInOrder.push(weekdays[startingIndex])
            startingIndex++;
        }

        return weekDaysInOrder
    }

    // Decide what icon to show
    getIcon(temperature) {

        if (temperature < 2) return snowIcon
        else if (temperature < 5) return rainIcon
        else if (temperature < 15) return sunCloudsIcon
        else return sunIcon

    }

    render() {

        const { temperature_2m, time } = this.props['temperatureData'];

        let tempAndTime = this.combineTemperatueAndTime(temperature_2m, time);
        let LowsAndHighs = this.getMinMaxMeanByDay(tempAndTime);
        let weekDaysInOrder = this.getNextDaysFromToday();

        let WeeklyData = [];

        // Variables for calculating bar width
        // I have no idea what i did here but it works 
        let step = 0;
        let left = 0;
        let middle = 0;
        let oneStepInPercentage = 0;
        let diff = 0;

        for (let i = 0; i < weekDaysInOrder.length; i++) {

            step = (LowsAndHighs[0][i] - LowsAndHighs[1][i]);
            left = (LowsAndHighs[0][i] - LowsAndHighs[2][i]);
            middle = (LowsAndHighs[0][i] + LowsAndHighs[1][i]) / 2;
            oneStepInPercentage = (100 / step);
            diff = Math.abs(middle - LowsAndHighs[2][i]);
            if (diff === 0) diff = 0.1;

            // console.log("Middle: ", middle, "Mean:", LowsAndHighs[2][i], "diff: ", diff, "step:", step, "left", left, "oneSt", oneStepInPercentage, "wf", widthFree)

            WeeklyData.push(
                <div key={uuidv4()} className="WeatherWeekly-SingleDay">
                    <p className='WeatherWeekly-Day'> {weekDaysInOrder[i].slice(0, 3)}. </p>
                    <img src={this.getIcon((LowsAndHighs[0][i] + LowsAndHighs[1][i]) / 2)} alt='weather-icon' />

                    <p className='WeatherWeekly-DayLow'> {LowsAndHighs[1][i]}° </p>

                    <div className='WeatherWeekly-Bar-Container'>
                        <div className='WeatherWeekly-Bar-Box' style={{ width: `${oneStepInPercentage * left / 2}%`, left: `${50 - (oneStepInPercentage * diff)}%` }}> </div>
                    </div>

                    <p className='WeatherWeekly-DayHigh'> {LowsAndHighs[0][i]}° </p>

                </div>

            )
        }

        // console.log(WeeklyData)

        return (
            <div className='WeatherWeekly' >
                {WeeklyData}
            </div>
        );
    }
}

export default WeatherWeekly;