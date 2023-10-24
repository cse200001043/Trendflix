import cv2
import numpy as np
import os


def cropMultipleObjects():
    inputPath = "FrameToObjects/RemovedBackground"
    outputPath = "FrameToObjects/Objects"
    # to delete previous files from outputPath
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
        input_image = cv2.imread(imagePath, cv2.IMREAD_UNCHANGED)
        # converting to gray scale
        gray = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
        # applying canny edge detection
        edged = cv2.Canny(input_image, 10, 250)
        # finding contours
        (cnts, _) = cv2.findContours(edged.copy(),
                                     cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        idx = 0
        for c in cnts:
            x, y, w, h = cv2.boundingRect(c)
            if w > 20 and h > 20:
                cnt += 1
                new_img = input_image[y:y+h, x:x+w]
                cv2.imwrite(outputPath + "/" + str(cnt) + '.png', new_img)
