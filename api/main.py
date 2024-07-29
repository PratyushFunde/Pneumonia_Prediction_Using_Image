from fastapi import FastAPI,File,UploadFile
import uvicorn 
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import io

from fastapi.responses import JSONResponse
app=FastAPI()

MODEL=tf.keras.models.load_model("../model2.keras")

def getPrediction(img_arr):
    new_arr=np.expand_dims(img_arr,0)
    ans=MODEL.predict(new_arr)
    return ans
@app.get('/ping')
async def ping():
    return "Hello I am Alive"

TARGET_SIZE = (256, 256)  # Width, Height

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    # Read the image file
    image_bytes = await file.read()
    
    # Convert bytes to a PIL Image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Ensure the image is in RGB mode (3 channels)
    image = image.convert('RGB')
    
    # Resize the image to the desired size
    image = image.resize(TARGET_SIZE)
    
    # Convert PIL Image to NumPy array
    image_np = np.array(image)
    
    prediction=getPrediction(image_np)
    print(prediction)
    result="Normal"
    if(prediction==1):
        result="PNEUMONIA"
    else:
       result="NORMAL"
    # Return some info about the image
    return JSONResponse(content={
        "width": image_np.shape[1],
        "height": image_np.shape[0],
        "channels": image_np.shape[2] if len(image_np.shape) == 3 else 1,
        "Prediction":result
    })


if __name__=="__main__":
    uvicorn.run(app,host='localhost',port=8000)