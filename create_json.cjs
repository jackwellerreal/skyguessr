// get fs
const fs = require('fs');

const island = "hub";

const contentDir = './public/content/'+island;
const files = fs.readdirSync(contentDir);

const locationDataPath = './public/content/location_data.json';
const locationData = JSON.parse(fs.readFileSync(locationDataPath, 'utf8'));

files.forEach(file => {
    if (file.endsWith('.png')) {
        let data = {
            "id": file.replace('.png', ''),
            "image": file,
            "name": "",
            "map": island,
            "location": [0,0],
            "difficulty": 0
        }

        locationData[island][data.id] = data;
        console.log(`Added location data for ${data.id}`);
    }
});

fs.writeFileSync(locationDataPath, JSON.stringify(locationData, null, 4), 'utf8');