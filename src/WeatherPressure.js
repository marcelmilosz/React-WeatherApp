import React, { Component } from 'react';
import './styles/WeatherPressure.css'

class WeatherPressure extends Component {



    render() {

        const { currentPressure } = this.props

        return (
            <div className='WeatherPressure'>
                <p className='WeatherPressure-Text'> Current pressure</p>
                <p className='WeatherPressure-Pressure'> {Math.floor(currentPressure)}<br /><span>hPa</span></p>
            </div>
        );
    }
}

export default WeatherPressure;