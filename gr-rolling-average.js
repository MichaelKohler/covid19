const axios = require('axios');

const START_DATE = '2021-08-01';
const REGIONS = [{
  id: 'EL255',
  name: 'Messenia',
}, {
  id: 'EL422',
  name: 'Cyclades',
}];
const WINDOW_SIZE = 7;

async function run({ id, name }) {
  const URL = getURLForID(id);
  const { data } = await axios.get(URL);
  const population = data[0].population;
  const newCases = data.map((entry) => entry.new_cases);
  const windows = getWindows(newCases);

  console.log(name.toUpperCase());
  logRollingAverage(windows, population);
}

function getURLForID(id) {
  return `https://covid.imedd.org/greece/${id}/all/${START_DATE}`;
}

function getWindows(newCases) {
  const windows = [];
  for (let i = newCases.length; i > 0; i--) {
    if (i < WINDOW_SIZE) {
      break;
    }

    const window = newCases.slice(i - WINDOW_SIZE, i);
    windows.push(window);
  }

  return windows;
}

function logRollingAverage(windows, population) {
  console.log(`Population: ${population}`);
  console.log('Rolling average new cases per 100k, descending order from today towards the past:');

  windows.forEach((window) => {
    const sum = window.reduce((acc, newCases) => acc + newCases, 0);
    const averagePer100k = sum * 100_000 / population / WINDOW_SIZE;
    console.log(averagePer100k.toFixed(3));
  });

  console.log('------------------------------------');
}

REGIONS.forEach((region) => {
  run(region);
});