from rembg import remove
from PIL import Image
import os

def removeBackground():
    inputPath = "../input"
    outputPath = "RemovedBackground"
    
    for filename in os.listdir(outputPath):
        file_path = os.path.join(outputPath, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting {filename}: {e}")
    cnt = 0
    for filename in os.listdir(inputPath):
        imagePath = os.path.join(inputPath, filename)
        input = Image.open(imagePath)
        output = remove(input)
        output.save(outputPath + "/" + "output" + str(cnt) + ".png"  )
        cnt = cnt + 1