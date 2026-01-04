from flask import Flask, render_template
import requests
from datetime import datetime

app = Flask(__name__)

API_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

@app.route("/")
def index():
    earthquakes = []

    try:
        r = requests.get(API_URL, timeout=10)
        r.raise_for_status()
        data = r.json()["features"]

        for eq in data:
            prop = eq["properties"]
            geo = eq["geometry"]

            earthquakes.append({
                "title": prop["place"],
                "mag": round(prop["mag"], 1) if prop["mag"] else 0,
                "lat": geo["coordinates"][1],
                "lng": geo["coordinates"][0],
                "date": datetime.utcfromtimestamp(prop["time"] / 1000).strftime("%d.%m.%Y %H:%M")
            })

    except Exception as e:
        print("API Hatası:", e)

    return render_template("index.html", earthquakes=earthquakes)

if __name__ == "__main__":
    app.run(debug=True)
