const fs = require('fs');
const axios = require('axios');

// Start date (January 2022)
let year = 2017;
let month = 1;

// End date (March 2023)
const endYear = 2022;
const endMonth = 12;

const commodity_type = "SPF"

let result = "";
// fetch data by month interval
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return [year, month, day]
}

async function fetchData() {
    while (year < endYear || (year === endYear && month <= endMonth)) {
        // Fetch data
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);

        const url = `https://www.taifex.com.tw/cht/3/futDataDown?down_type=1&commodity_id=${ commodity_type }&queryStartDate=${ startStr[0] }/${ startStr[1] }/${ startStr[2] }&queryEndDate=${ endStr[0] }/${ endStr[1] }/${ endStr[2] }`; 
        console.log(url)

        await axios.post(url, {}, {
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
        .then(data => {
            result += data.data
        })
        .catch(err => {
            console.error('Error:', err);
        });

        if (month === 12) {
            month = 1;
            year++;
        } else {
            month++;
        }
    }

    fs.writeFile('fetched_data.csv', result, { encoding: 'utf-8' }, (err) => {
        if (err) throw err;
        console.log('CSV file saved!');
    });
}

fetchData();
