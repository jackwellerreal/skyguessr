// get fs
const fs = require("fs");

const island = "farming_islands";

const contentDir = "./public/content/" + island;
const files = fs.readdirSync(contentDir);

const locationDataPath = "./public/content/location_data.json";
const locationData = JSON.parse(fs.readFileSync(locationDataPath, "utf8"));

files.forEach((file) => {
    if (file.endsWith(".png")) {
        if (
            locationData[island] &&
            locationData[island][file.replace(".png", "")]
        ) {
            console.log(
                `Location data for ${file.replace(".png", "")} already exists.`
            );
            return;
        }

        let data = {
            id: file.replace(".png", ""),
            image: file,
            name: "",
            map: island,
            location: [0, 0],
            difficulty: 0,
            underground: false,
        };

        locationData[island][data.id] = data;
        console.log(`Added location data for ${data.id}`);
    }
});

fs.writeFileSync(
    locationDataPath,
    JSON.stringify(locationData, null, 4),
    "utf8"
);
