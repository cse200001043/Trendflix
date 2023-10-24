import cv2
import numpy as np


def blurFace():
    input_image = cv2.imread("FrameToObjects/Object/output0.png")
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    gray_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=4, minSize=(5, 5))
    mask = np.zeros_like(input_image)
    for (x, y, w, h) in faces:
        face_region = input_image[y:y+h, x:x+w]
        # Adjust the blur parameters as needed
        face_region = cv2.GaussianBlur(face_region, (99, 99), 30)
        input_image[y:y+h, x:x+w] = face_region
    result_image = cv2.bitwise_or(input_image, mask)
    cv2.imwrite("Wearable/output0.png", result_image)


if __name__ == "__main__":
    blurFace()
