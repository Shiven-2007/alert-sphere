import time
import requests
import json
import feedparser

# Function to fetch earthquake data from USGS
def fetch_usgs_earthquake_data():
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch USGS data: {e}")
        return None

# Function to fetch GDACS RSS feed
def fetch_gdacs_rss_feed():
    url = "https://www.gdacs.org/xml/rss.xml"
    try:
        feed = feedparser.parse(url)
        if feed.entries:
            return feed.entries
        else:
            print("No entries in GDACS feed.")
            return None
    except Exception as e:
        print(f"Failed to fetch GDACS RSS feed: {e}")
        return None

# Function to fetch ReliefWeb data
def fetch_reliefweb_data():
    url = "https://api.reliefweb.int/v1/reports?appname=apidoc"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch ReliefWeb data: {e}")
        return None

# Function to fetch Google News data
def fetch_google_news_data(query="disaster"):
    api_key = "980cb2b4bc0640e28b9432262b05df1d"  # Replace with your API key
    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={api_key}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch Google News data: {e}")
        return None

# Function to store data in a JSON file
def store_data(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

# Function to update and store disaster datasets
def update_dataset():
    earthquake_data = fetch_usgs_earthquake_data()
    gdacs_rss_data = fetch_gdacs_rss_feed()
    reliefweb_data = fetch_reliefweb_data()
    google_news_data = fetch_google_news_data()

    combined_data = {
        "earthquake_data": earthquake_data,
        "gdacs_rss_data": gdacs_rss_data,
        "reliefweb_data": reliefweb_data,
        "google_news_data": google_news_data
    }

    # Store combined data
    store_data('combined_disaster_data.json', combined_data)
    print("Dataset updated with real-time data!")

# Function to check data (without notifications)
def check_data():
    try:
        with open('combined_disaster_data.json', 'r') as f:
            data = json.load(f)

        # Check for significant earthquakes (magnitude > 5.0 for urgent alerts, 3-5 for mild warnings)
        if data['earthquake_data']:
            for quake in data['earthquake_data']['features']:
                mag = quake['properties']['mag']
                place = quake['properties']['place']
                if mag > 5.0:
                    print(f"Urgent: Earthquake of magnitude {mag} at {place}")
                elif 3.0 <= mag <= 5.0:
                    print(f"Mild: Earthquake of magnitude {mag} at {place}")

        # Check for disasters in GDACS feed (tsunamis, floods, cyclones)
        if data['gdacs_rss_data']:
            for entry in data['gdacs_rss_data']:
                if "Tsunami" in entry.title or "Flood" in entry.title or "Cyclone" in entry.title:
                    print(f"Urgent: {entry.title}\nDetails: {entry.link}")

        # Check for ReliefWeb disaster alerts
        if data['reliefweb_data']:
            for report in data['reliefweb_data']['data']:
                if "disaster" in report['fields']['title'].lower():
                    print(f"Disaster Alert: {report['fields']['title']}\nDetails: {report['fields']['url']}")

        # Check for general disaster news from Google News
        if data['google_news_data']:
            for article in data['google_news_data']['articles']:
                if "disaster" in article['title'].lower():
                    print(f"Disaster Alert: {article['title']}\nDetails: {article['url']}")

    except Exception as e:
        print(f"Error during data check: {e}")

# Real-time dataset update and data check (without notifications)
def update_dataset_and_check():
    update_dataset()
    check_data()

# Manually trigger the real-time update and check process for testing
update_dataset_and_check()

import schedule
schedule.every(30).minutes.do(update_dataset_and_check)

while True:
    schedule.run_pending()
    time.sleep(1)