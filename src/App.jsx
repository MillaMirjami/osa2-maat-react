import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('') // Input-hakuarvo
  const [countries, setCountries] = useState([]) // lista kaikista maista
  const [search, setSearch] = useState(null) // Hakuehto
  const [weather, setWeather] = useState({}) // yhden maan säätiedot

  useEffect(() => {
    console.log('effect run, searhed country/ies is now ', search)

    if(search) {
      console.log('fetching countries...')
      axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const filteredCountries = response.data.filter(country =>
          country.name.common.toLowerCase().includes(search.toLowerCase()))
          setCountries(filteredCountries)
          if(filteredCountries.length === 1) {
            console.log('The one match for search: ', filteredCountries[0].name.common)
            console.log(`${filteredCountries[0].capitalInfo.latlng[0]}`)
            axios
            .get(`https://api.open-meteo.com/v1/forecast?latitude=${filteredCountries[0].capitalInfo.latlng[0]}&longitude=${filteredCountries[0].capitalInfo.latlng[1]}&current=temperature_2m,wind_speed_10m&wind_speed_unit=ms`)
            .then(response => {
              console.log(response.data)
              setWeather(response.data)
            })
          }
      })
    }
    else {
      setCountries([])
    }
  }, [search])

  const handleChange = (event) => {
    setValue(event.target.value)
    setSearch(event.target.value)
  }

  return (
    <div>
      find countries<input type="text" value={value} onChange={handleChange}/>
      <div>
        {countries.length > 10 ? 
        (<p>Too many matches, specify another filter</p>) : 
        countries.length === 1 ?
        (<div>
          <h2>{countries[0].name.common}</h2>
          <p>capital {countries[0].capital}</p>
          <p>area {countries[0].area}</p>
          <h3>languages:</h3>
            <ul>
              {Object.values(countries[0].languages).map((language, idx) => (
                <li key={idx}>{language}</li>
              ))}
            </ul>
          <figure>
            <img src={countries[0].flags.png} width="200"/>
          </figure>
          <h3>Weather in {countries[0].capital}</h3>
          <p>Temperature {weather.current.temperature_2m} Celcius</p>
          <p>Wind {weather.current.wind_speed_10m} m/s</p>
        </div>) :
        (countries.map((country, index) => (
          <p key={index}>{country.name.common}</p>)))
        }
      </div>
    </div>
  )
}

export default App
