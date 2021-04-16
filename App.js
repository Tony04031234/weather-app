import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import * as Location from 'expo-location'

import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import { colors } from './utils/index'
import ReloadIcon from './components/ReloadIcon'


const WEATHER_API_KEY = 'a65200c5775b2876b313e125ed8ffad6'
const BASE_WEATHER_HTTP = 'https://api.openweathermap.org/data/2.5/weather?'

export default function App() {
	const [errorMessage, setErrorMessage] = useState(null)
	const [currentWeather, setCurrentWeather] = useState(null)
	const [unitsSystem, setUnitsSystem] = useState('metric') // change the unit system here 

	useEffect(() => {
		load()
	}, [unitsSystem])

	async function load() {
		setCurrentWeather(null)
        setErrorMessage(null)
		try {
			let { status } = await Location.requestPermissionsAsync()

			if (status !== 'granted') {
				setErrorMessage('Access to location is needed to run the app')
				return
			}
			const location = await Location.getCurrentPositionAsync()
			const { latitude, longitude } = location.coords
			const weatherUrl = `${BASE_WEATHER_HTTP}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`
			const response = await fetch(weatherUrl) // send request and get data back
			const result = await response.json() // convert into json so we can work with

			if (response.ok) { // if response = 200 -> ok 
				setCurrentWeather(result)
			} 
			else {
				setErrorMessage(result.message) // if not -> send back the server message
			}
		} 
		catch (error){
			setErrorMessage(error.message)
		}
	}
	
	if (currentWeather) {
		return(
			<View style={styles.container}>
				<StatusBar style="auto" />
				<View style={styles.main} >
					<WeatherInfo currentWeather={currentWeather} />
					<ReloadIcon load={load} />
					<UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem} />
				</View>
			</View>
		)
	}
	 else if (errorMessage) {
		return (
			<View style={styles.container}>
				<ReloadIcon load={load} />
				<Text style={{ textAlign: 'center' }}>{errorMessage}</Text>
				<StatusBar style="auto" />
			</View>
			)
		} 
	else {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
				<StatusBar style="auto" />
			</View> 
		)
	}

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
		alignItems: 'center',
    },
    main: {
        justifyContent: 'center',
        flex: 1,
    },
})

		/*const {
			main : {temp},
		} = currentWeather
		*/