
import httpx

# URL of your FastAPI endpoint
url = 'http://localhost:8000/disaster-data'

async def get_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            print("Response received successfully.")
            print(response.json())  # Print the JSON response
        else:
            print("Failed to retrieve data.")
            print("Status code:", response.status_code)
            print("Response text:", response.text)

# To run the async function, use an event loop
if __name__ == "__main__":
    import asyncio
    asyncio.run(get_data())
