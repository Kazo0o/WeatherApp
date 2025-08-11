from flask import Flask, Response
from datetime import datetime, timezone
from flask import request
import requests
import json
from flask_cors import CORS
from markupsafe import escape
import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, accuracy_score

app = Flask(__name__)
CORS(app)

# setup openmeteo api client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

ip = requests.get("https://api64.ipify.org").text
location = requests.get("http://ip-api.com/json/{}".format(ip)).json()

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
url = "https://api.open-meteo.com/v1/forecast"

params = {
	"latitude": location["lat"],
	"longitude": location["lon"],
	"daily": ["temperature_2m_min", "weather_code", "temperature_2m_max", "rain_sum", "precipitation_sum", "showers_sum", "wind_speed_10m_max"],
	"hourly": ["temperature_2m", "rain", "precipitation", "wind_speed_10m", "precipitation_probability", "weather_code", "showers", "snowfall", "snow_depth", "cloud_cover", "visibility", "wind_direction_10m"],
	"current": ["temperature_2m", "precipitation", "showers", "wind_speed_10m", "wind_direction_10m", "rain", "snowfall", "weather_code"],
	"timezone": location["timezone"]
}

responses = openmeteo.weather_api(url, params=params)
response = responses[0]

# Current values. The order of variables needs to be the same as requested.
current = response.Current()

current_temperature_2m = current.Variables(0).Value()

current_precipitation = current.Variables(1).Value()

current_showers = current.Variables(2).Value()

current_wind_speed_10m = current.Variables(3).Value()

current_wind_direction_10m = current.Variables(4).Value()

current_rain = current.Variables(5).Value()

current_snowfall = current.Variables(6).Value()

current_weather_code = current.Variables(7).Value()
lat = response.Latitude()
lon = response.Longitude()
# print(f"Current time {current.Time()}")

hourly = response.Hourly()
hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
hourly_rain = hourly.Variables(1).ValuesAsNumpy()
hourly_precipitation = hourly.Variables(2).ValuesAsNumpy()
hourly_wind_speed_10m = hourly.Variables(3).ValuesAsNumpy()
hourly_precipitation_probability = hourly.Variables(4).ValuesAsNumpy()
hourly_weather_code = hourly.Variables(5).ValuesAsNumpy()
hourly_showers = hourly.Variables(6).ValuesAsNumpy()
hourly_snowfall = hourly.Variables(7).ValuesAsNumpy()
hourly_snow_depth = hourly.Variables(8).ValuesAsNumpy()
hourly_cloud_cover = hourly.Variables(9).ValuesAsNumpy()
hourly_visibility = hourly.Variables(10).ValuesAsNumpy()
hourly_wind_direction_10m = hourly.Variables(11).ValuesAsNumpy()

hourly_data = {}
hourly_data["temperature_2m"] = hourly_temperature_2m
hourly_data["rain"] = hourly_rain
hourly_data["precipitation"] = hourly_precipitation
hourly_data["wind_speed_10m"] = hourly_wind_speed_10m
hourly_data["precipitation_probability"] = hourly_precipitation_probability
hourly_data["weather_code"] = hourly_weather_code
hourly_data["showers"] = hourly_showers
hourly_data["snowfall"] = hourly_snowfall
hourly_data["snow_depth"] = hourly_snow_depth
hourly_data["cloud_cover"] = hourly_cloud_cover
hourly_data["visibility"] = hourly_visibility
hourly_data["wind_direction_10m"] = hourly_wind_direction_10m

hourly_data = {"date": pd.date_range(
	start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
	end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
	freq = pd.Timedelta(seconds = hourly.Interval()),
	inclusive = "left"
)}

hourly_dataframe = pd.DataFrame(data = hourly_data)



# paramsHistory={
#     "latitude": location["lat"],
# 	"longitude": location["lon"],
#     "start_date": "2023-01-01",
# 	"end_date": "2024-12-31",
# 	"hourly": ["temperature_2m", "rain",, "wind_speed_10m"],
# 	"timezone": location["timezone"]
# }

# hResponses = openmeteo.weather_api(urlH, params=paramsHistory)
# hResp = hResponses[0]

# # print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
# # print(f"Elevation {response.Elevation()} m asl")
# # print(f"Timezone {response.Timezone()}{response.TimezoneAbbreviation()}")
# # print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")
# h_hourly = hResp.Hourly()
# h_current = hResp.Current()
# h_daily = hResp.Daily()

# function that gets the historical data on request
def get_historical_data(start_date, end_date):
    """
        Fetches historical weather data from OpenMeteo's Historical Weather API using openmeteo_requests
    Args:
        lon: Longitude of the device,
        lat: Latitude of the device,
        start_date (str): Start date in 'YYYY-MM-DD' format.
        end_date (str): End date in 'YYYY-MM-DD' format.
        client (openmeteo_requests.Client): An initialized OpenMeteo client.

    """
    # for the historical data
    urlH = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": location["lat"],
        "longitude": location["lon"],
        "start_date": start_date,
        "end_date": end_date,
        "hourly": ["temperature_2m", "rain", "wind_speed_10m"],
        "timezone": "GMT"
    }
    try:
        print(f"making api request to {urlH} with params {params}")
        hresponses = openmeteo.weather_api(urlH, params)
        if not hresponses:
            print("Error: no response from OpenMeteo API")
            return None, None
        hresponse = hresponses[0] # get the first response
        h_hourly = hresponse.Hourly()

        # get the value for temperature
        # temp: 0, rain: 1, wind: 2 (according to list of params order)
        temp_values = h_hourly.Variables(0).ValuesAsNumpy().tolist() # pyright: ignore[reportOptionalMemberAccess]
        rain_values = h_hourly.Variables(1).ValuesAsNumpy().tolist() # pyright: ignore
        wind_values = h_hourly.Variables(2).ValuesAsNumpy().tolist() # pyright: ignore

        # reconstruct the time series using Time(), TimeEnd(), and Interval()
        time_range_start_series = h_hourly.Time() # pyright: ignore
        time_range_end_series = h_hourly.TimeEnd() # pyright: ignore
        interval_series = h_hourly.Interval() # pyright: ignore

        time_data_index = pd.date_range(
            start=pd.to_datetime(time_range_start_series, unit="s", utc=True),
            end=pd.to_datetime(time_range_end_series, unit="s", utc=True),
            freq=pd.Timedelta(seconds=interval_series),
            inclusive="left"
        )

        # crucial check: ensure the length of time data matches temp, rain and wind data
        if len(time_data_index) != len(temp_values):
            print("time data length does not match temperature values length")
            time_data_index = time_data_index[:len(temp_values)] # trim if mismatch

        if len(time_data_index) != len(rain_values):
            print("time data length does not match rain values length")
            time_data_index = time_data_index[:len(rain_values)] # trim if mismatch

        if len(time_data_index) != len(wind_values):
            print("time data length does not match wind values length")
            time_data_index = time_data_index[:len(wind_values)] # trim if mismatch

        print("successfully fetched data")
        return time_data_index, temp_values, rain_values, wind_values
    except Exception as e:
        print(f"An error occurred during API call or data extraction: {e}\n")
        return None, None

@app.route('/api/', methods=['GET'])
def hello():
    return "<p>Hello World!</p>"

@app.route('/api/user/<name>', methods=['GET'])
def hello_world(name):
    return f"Hello {escape(name)}!"

""" @app.route('/api/analyse', methods=['GET'])
def analyseData():
    return None """

# @app.route("/api/history_hourly", methods=["GET"])
# def sendHistHourlyData():
#     if not h_hourly:
#         print("No data to use")
#         return {}
#     history_hourly_data = {"data": pd.date_range(
#         start=pd.to_datetime(h_hourly.Time(), unit = "s", utc=True),
#         end=pd.to_datetime(h_hourly.TimeEnd(), unit = "s", utc=True),
#         freq=pd.Timedelta(seconds=h_hourly.Interval()),
#         inclusive="left"
#     )}

#     h_hourly_df = pd.DataFrame(data=history_hourly_data)
#     print(h_hourly_df.head())
#     return json.dumps(h_hourly_df.head().to_json())

# @app.route("/api/yearly_averages", methods=['GET'])
# def calculate_yearly_average_temp():
    # if not h_hourly:
    #     return {}

    # time_range_start = h_hourly.Time()
    # time_range_end = h_hourly.TimeEnd()

    # interval = h_hourly.Interval()


    # time_data_pandas_dt_index  = pd.date_range(
    #     start=pd.to_datetime(time_range_start, unit="s", utc=True),
    #     end=pd.to_datetime(time_range_end, unit="s", utc=True),
    #     freq=pd.Timedelta(seconds=interval),
    #     inclusive="left"
    # )

    # temp_values = h_hourly.Variables(0).ValuesAsNumpy().tolist()

    # if len(time_data_pandas_dt_index ) != len(temp_values):
    #     print(f"Warning: Time data length ({len(time_data_pandas_dt_index )}) does not match temperature data length ({len(temp_values)})")
    #     time_data_pandas_dt_index  = time_data_pandas_dt_index [:len(temp_values)]

    # time_data_iso_strings = [ts.isoformat() for ts in time_data_pandas_dt_index ]
    # h_data = {
    #     "time": time_data_iso_strings,
    #     "temperature_2m": temp_values
    # }

@app.route("/api/yearly_averages/<start_date>/<end_date>", methods=['GET'])
def send_yearly_avg_temps(start_date, end_date):
    """ Calculates the yearly average temperature (in Celsius) from time and temperature data
    Args:
    time_data (pd.DatetimeIndex): A pandas DatetimeIndex containing the timestamps.
    temp_data (list or np.array): A list or array of temperature values, corresponding to the time_data
    Returns:
    dict: A dictionary where keys are years and values are their average temperatures
    """

    time_data, temp_data, rain_data, wind_data = get_historical_data(start_date=start_date, end_date=end_date)
    if time_data is not None and temp_data is not None and rain_data is not None and wind_data is not None:
        data_df = pd.DataFrame({
            "time": time_data,
            "temperature": temp_data,
            "rain": rain_data,
            "wind": wind_data
        })

    print(f"Calculating yearly temp averages between {start_date} and {end_date}")

    # extract year from the timestamp
    data_df['year'] = data_df['time'].dt.year # type: ignore

    # group by year and calculate means
    avg_temp = data_df.groupby('year')['temperature'].mean().to_dict() # type: ignore
    avg_rain = data_df.groupby('year')['rain'].mean().to_dict() # type: ignore
    avg_wind = data_df.groupby('year')['wind'].mean().to_dict() # type: ignore

    yearly_data = {}
    years = sorted(avg_temp.keys())

    for year in years:
        yearly_data[year] = {
            "temp": avg_temp.get(year),
            "rain": avg_rain.get(year),
            "wind": avg_wind.get(year)
        }

    return json.dumps(yearly_data, indent=4)


@app.route("/api/monthly_averages/<start_date>/<end_date>", methods=['GET'])
def send_monthly_avg_temps(start_date, end_date):
    """ Calculates the monthly average temperature (in Celsius) from time and temperature data
    Args:
    time_data (pd.DatetimeIndex): A pandas DatetimeIndex containing the timestamps.
    temp_data (list or np.array): A list or array of temperature values, corresponding to the time_data
    Returns:
    dict: A dictionary where keys are years and values are their average temperatures
    """

    time_data, temp_data, rain_data, wind_data = get_historical_data(start_date=start_date, end_date=end_date)
    if time_data is not None and temp_data is not None and rain_data is not None and wind_data is not None:
        data_df = pd.DataFrame({
            "time": time_data,
            "temperature": temp_data,
            "rain": rain_data,
            "wind": wind_data
        })

    print(f"Calculating monthly temp averages between {start_date} and {end_date}")

    # extract month from the timestamp
    data_df['year'] = data_df['time'].dt.year
    data_df['month'] = data_df['time'].dt.month # type: ignore

    # group by both year and month and calculate means
    avg_monthly_data = data_df.groupby(['year', 'month']).agg({
        'temperature': 'mean',
        'rain': 'mean',
        'wind': 'mean'
    }).reset_index()

    print(avg_monthly_data.head())

    # avg_temp = data_df.groupby('month')['temperature'].mean().to_dict() # type: ignore
    # avg_rain = data_df.groupby('month')['rain'].mean().to_dict() # type: ignore
    # avg_wind = data_df.groupby('month')['wind'].mean().to_dict() # type: ignore

    monthly_data = {}

    for index, row in avg_monthly_data.iterrows():
        year = int(row['year'])
        month = int(row['month'])

        """
            Convert the month number to a month name
            Using datetime.strptime() is a reliable way to get the full month name
            datetime.strptime(str(month_number), "%m"): This parses the month number (as a string) and understands it as a month. For example, it turns "1" into a datetime object for January.
            .strftime("%B"): This formats the datetime object into a string representing the full month name. "%B" is the format code for the full month name (e.g., "January").
        """
        month_name = datetime.strptime(str(month), "%m").strftime("%B")

        # if the year doesn't exist for our dict, create it
        if year not in monthly_data:
            monthly_data[year] = {}

        # add the monthly data to the corresponding year
        monthly_data[year][month_name] = {
            "temp": row['temperature'],
            "rain": row['rain'],
            "wind": row['wind']
        }

    return json.dumps(monthly_data, indent=4)

@app.route('/api/current', methods=['GET'])
def sendCurrentData():
    data = {
        "temp":current_temperature_2m,
        "prec": current_precipitation,
        "shower": current_showers,
        "wind_speed": current_wind_speed_10m,
        "wcode": current_weather_code,
        "wind_dir": current_wind_direction_10m,
        "rain": current_rain,
        "snow": current_snowfall,
        "lat": lat,
        "lon": lon,
        "timezone": location["timezone"]
        }
    return json.dumps(data)

@app.route('/api/hourly', methods=['GET'])
def sendHourlyData():
    # Get current UTC time
    now = datetime.now(timezone.utc)

    # Filter rows where date is after current time
    filtered_df = hourly_dataframe[hourly_dataframe["date"] > now]

    # Convert to ISO string for JSON
    filtered_df["date"] = filtered_df["date"].dt.strftime('%Y-%m-%dT%H:%M:%SZ')

    # Send filtered JSON
    json_data = filtered_df.to_json(orient="records")
    return Response(json_data, mimetype="application/json")

if __name__ == '__main__':
    app.run(port=5000)