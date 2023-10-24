# import opencv
import cv2
import numpy as np
import os

def cropSingleObject():
    inputPath = "FrameToObjects/RemovedBackground"
    outputPath = "Wearable"

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

        height = input_image.shape[0]
        width = input_image.shape[1]
        # Checking image is grayscale or not. If image shape is 2 then gray scale otherwise not
        if len(input_image.shape) == 2:
            gray_input_image = input_image.copy()
        else:
            # Converting BGR image to grayscale image
            gray_input_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
        # To find upper threshold, we need to apply Otsu's thresholding
        upper_threshold, thresh_input_image = cv2.threshold(
            gray_input_image, thresh=0, maxval=255, type=cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )
        # Calculate lower threshold
        lower_threshold = 0.5 * upper_threshold

        # Apply canny edge detection
        canny = cv2.Canny(input_image, lower_threshold, upper_threshold)
        # Finding the non-zero points of canny
        pts = np.argwhere(canny > 0)

        # Finding the min and max points
        y1, x1 = pts.min(axis=0)
        y2, x2 = pts.max(axis=0)

        # Crop ROI from the givn image
        output_image = input_image[y1:y2, x1:x2]

        output_path = outputPath + "/" + "output" + str(cnt) + ".png"
        cnt += 1
        # Save image
        cv2.imwrite(output_path, output_image)        
