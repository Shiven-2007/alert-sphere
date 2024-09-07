from fastapi import FastAPI
import json
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/disaster-data")
def get_disaster_data():
    data_files = ["gdacs_rss_feed.json"]
    combined_data = {}

    for file in data_files:
        file_path = os.path.join(os.path.dirname(__file__), file)
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                combined_data[file.replace(".json", "")] = json.load(f)
        else:
            combined_data[file.replace(".json", "")] = {}

    return combined_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
