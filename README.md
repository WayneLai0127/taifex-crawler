# Fetching Data from Taifex Website

This code fetches data from the Taifex website (https://www.taifex.com.tw) by month interval using axios to make a post request. The data is then saved as a CSV file. In our implementation, **we focused on the SPF data, but you could change vairable: `commity_type` into any other data that is available on the website.**

## Prerequisites

Before running the code, you need to have Node.js installed on your system. You can download and install it from the official Node.js website.

## Installation

To install the required packages, run the following command:

# npm install axios

## Usage

Run the following command in your terminal to execute the code:

node crawler.js && node convert.js


## Code Description

The code has two parts. The first part fetches the data from the Taifex website, and the second part reads and processes the data from the CSV file.

### Part 1 (crawler.js)

This part of the code fetches the data from the Taifex website by month interval. The start and end dates can be adjusted by modifying the variables year, month, endYear, and endMonth. The fetchData function formats the dates, generates the URL, and makes the request using axios. The response data is appended to the result variable. Once all the data has been fetched, the fs.writeFile function is used to save the data as a CSV file.

### Part 2 (convert.js)

This part of the code reads and processes the data from the CSV file. The readCSV function reads the data from the file and returns an array of objects, where each object represents a row in the CSV file. The getLastChar function returns the last character in a string. The data.filter function filters the data based on certain conditions, and the columnsToDrop array contains the column names to be removed from the data. The filtered and processed data is then stored in separate arrays based on the expiration date.

