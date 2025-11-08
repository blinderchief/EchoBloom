from fastapi import APIRouter

router = APIRouter()

@router.post("/sensors")
async def receive_sensor_data(data: dict):
    # Process passive sensor data
    return {"message": "Sensor data received"}