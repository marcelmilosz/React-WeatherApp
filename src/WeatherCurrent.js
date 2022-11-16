import React, { Component } from 'react';
import './styles/WeatherCurrent.css'

class WeatherCurrent extends Component {



    render() {

        const { currentTemperature } = this.props;

        // console.log(todayDate)

        return (
            <div className='WeatherCurrent'>
                <img src={currentTemperature[1]} alt='current temperature icon' />
                <p className='WeatherCurrent-Text'> Current <br />temperature </p>
                <p className='WeatherCurrent-Temperature'> {currentTemperature[0]}°</p>


            </div>
        );
    }
}

export default WeatherCurrent;