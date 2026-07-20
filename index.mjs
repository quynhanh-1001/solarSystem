import express from 'express';
import fetch from "node-fetch";

const planets = (await import('npm-solarsystem')).default;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const apiKey =
        "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";

    const url =
        `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=solar-system`;

    const response = await fetch(url);
    const data = await response.json();

    const randomImage = data.urls.full;

    res.render("index", {
        image: randomImage
    });
});

// app.get('/earth', (req, res) => {
//  res.render('earth')
// });
// app.get('/earth', (req, res) => {
//  let planetEarth = planets.getEarth();
//  console.log(planetEarth);
//  res.render('earth', {planetEarth});
// });

// app.get("/mars", (req, res) => {
//     const planetMars = planets.getMars();

//     planetMars.image =
//         "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png/960px-Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png";

//     res.render("mars", { planetMars });
// });

app.get('/planet', (req, res) => {
    let planetName = req.query.planetName;
    let planetInfo = planets[`get${planetName}`]();
    res.render('planet', { planetInfo, planetName });
});

app.get("/nasa", async (req, res) => {
    const url =
        "https://api.nasa.gov/planetary/apod" +
        "?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD" +
        "&date=2026-07-14";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`NASA API error: ${response.status}`);
        }

        const nasaInfo = await response.json();

        console.log(nasaInfo);

        res.render("nasa", {
            nasaInfo
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).send(
            "Unable to retrieve NASA Picture of the Day."
        );
    }
});

app.listen(3000, () => {
    console.log("Solar System server started");
});

