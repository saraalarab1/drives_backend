const express = require('express');
const fetch = require('node-fetch');

const app = express()
app.use(express.json())
app.use(express.static(__dirname))

const port = process.env.PORT || 3737;
const GOOGLE_MAPS_KEY = "AIzaSyCkUp9bjBMNJ94Uac9n_YzZXQHJOVutHAQ"

app.listen(port);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html')
})

app.post('/locationSuggestions', async(req, res) => {
    const location = req.body.location

    const result = await fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
            location + "&components=country:lb" + "&key=" + GOOGLE_MAPS_KEY)
        .then(res => res.json())

    console.log(result)
    res.json({ result: result.predictions })
})

app.post('/locationDetails', async(req, res) => {
    const place_id = req.body.place_id

    const result = await fetch("https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
            place_id + "&key=" + GOOGLE_MAPS_KEY)
        .then(res => res.json())

    res.json({ result: result.result.geometry.location })
})

app.post('/possibleRoutes', async(req, res) => {
    // const place_id = req.body.place_id
    let start_id = req.body.start_id || 'ChIJ-Ylp-M0QHxURZtOZgiymDpI'
    let destination_id = req.body.destination_id || 'ChIJi7oiX0hbHxURmrRW3kLWd7c'
    
    const url = "https://maps.googleapis.com/maps/api/directions/json?origin=place_id:" +
        start_id + "&destination=place_id:" + destination_id + "&alternatives=true" + 
        "&key=" + GOOGLE_MAPS_KEY
    console.log(url)
    const result = await fetch(url)
        .then(res => res.json())
    res.json({ result: result })
    console.log(result)
})