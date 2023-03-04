const fs = require('fs');
const columnNames = ["交易日期","契約","到期月份(週別)","開盤價","最高價","最低價","收盤價","漲跌價","漲跌%","成交量","結算價","未沖銷契約數","最後最佳買價","最後最佳賣價","歷史最高價","歷史最低價","是否因訊息面暫停交易","交易時段","價差對單式委託成交量"]
async function readCSV() {
    const result = [];
    //for (let year = 2017; year <= 2022 ; year++) {
        //const path = `${year}_fut.csv`;
    const path = 'output.csv'
    const text = await fs.promises.readFile(path, 'utf-8');
    const rows = text.split('\n');
    //const headers = rows[0].split(',');
    const headers = columnNames
    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        if (values.length !== headers.length) continue;
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = values[j];
        }
        result.push(obj);
    }
    //}
    return result;
}

function getLastChar(str) {
    return str.charAt(str.length - 1);
}

readCSV().then(data => {
    console.log(`Total length: ${data.length}`)
    const allData = []
    const expireMarch = []
    const expireJune = []
    const expireSeptember = []
    const columnsToDrop = ["最高價",
                            "最低價",
                            "最後最佳買價 ",
                            "最後最佳賣價 ",
                            "歷史最高價",
                            "歷史最低價 ",
                            "是否因訊息面暫停交易",
                            "最後最佳買價","最後最佳賣價","歷史最高價","歷史最低價","是否因訊息面暫停交易","交易時段","價差對單式委託成交量",
                            "到期月份(週別)"
                        ]
    data.filter(item => item["契約"] == "SPF" && item["交易時段"].includes("瑾") && item["到期月份(週別)"].length === 6).forEach( row => {
        row["到期日"] = row["到期月份(週別)"]
        columnsToDrop.forEach( column => {
            delete row[column]
        })
        const lastCharExpirationDate = getLastChar(row["到期日"])
        if (lastCharExpirationDate === "3") {
            expireMarch.push(row)
        }
        else if (lastCharExpirationDate === "6") {
            expireJune.push(row)
        }
        else if (lastCharExpirationDate === "9") {
            expireSeptember.push(row)
        }
        allData.push(row)
    })
    
    const [ csvMarch, csvJune, csvSep, csvAll ] = [ expireMarch, expireJune, expireSeptember, allData ].map( data => {
        //const headers = Object.keys(data[0]);
        const headers = [
            'trade_date', 'contract',
            'open_price', 'close_price',
            'change_price', 'change_percent',
            'volume', 'settlement_price',
            'open_interest', 'expiry_date'
        ]
        return [headers.join(',')].concat( data.map(obj => Object.values(obj).join(','))).join('\n');
    })
    // Write CSV data to a file
    fs.writeFile('./output/expire_march.csv', csvMarch, { encoding: 'utf-8' }, (err) => {
        if (err) throw err;
        console.log('CSV file saved!');
    });
    fs.writeFile('./output/expire_june.csv', csvJune, { encoding: 'utf-8' }, (err) => {
        if (err) throw err;
        console.log('CSV file saved!');
    });
    fs.writeFile('./output/expire_september.csv', csvSep, { encoding: 'utf-8' }, (err) => {
        if (err) throw err;
        console.log('CSV file saved!');
    });
    fs.writeFile('./output/all_data.csv', csvAll, { encoding: 'utf-8' }, (err) => {
        if (err) throw err;
        console.log('CSV file saved!');
    });

});