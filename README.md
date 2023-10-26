# TrendFlix

TrendFlix is a cutting-edge movie streaming platform that redefines the traditional streaming experience by seamlessly blending entertainment and fashion. Much like popular services such as Amazon Prime, TrendFlix offers a vast library of movies and TV shows for your viewing pleasure. However, what sets TrendFlix apart is its unique and innovative feature: the ability to display shopping links for products similar to the wearable items worn by your favorite movie stars.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Preprocessing](#preprocessing)
- [Usage](#usage)
- [Model Pipelining](#model-pipelining)
- [Project Overview](#project-overview)

## Introduction

### Machine Learning Algorithm for Movie Frames

Our machine learning algorithm for movie frames comprises four essential components, each serving a distinct purpose in enhancing and optimizing the visual and privacy aspects of the frames.

#### 1. Background Removal

Background removal is a critical step in isolating the primary subject or objects within each movie frame. By effectively eliminating the background, this component enhances the focus and clarity of the subject, resulting in visually appealing frames. We use the [Rembg](https://github.com/danielgatis/rembg) Library.

#### 2. Object Detection

Object detection, powered by [OpenCV (CV2)](https://opencv.org/), enables the automatic identification and localization of various objects within the movie frames. This component provides valuable insights into the composition of each frame, making it a versatile tool for analysis and enhancement.

#### 3. Face-Blurring

Face features form a significant part of the image, However, we do not want the face of the celebrity to influence our search results. So, we feed the image into a new ML model that uses CV2 to blur the face.

#### 4. Image Search

At this step, we have a filtered image without any background without any facial features of film stars. The image is now used to search for similar products from our database. The image search component has been implemented using [CLIP](https://openai.com/research/clip) by OpenAI.
These four components work in harmony to deliver a comprehensive and versatile solution for processing and optimizing movie frames.


### Rembg - Remove Image Backgrounds

Rembg is a Python library and command-line tool that removes the background from images. It's a handy tool for various applications, such as creating product images for e-commerce, isolating objects for graphic design, and much more. 

#### Features

- *Easy-to-Use*: Remove backgrounds from images with a simple Python library or command-line interface.
- *Supports Various Formats*: Works with a wide range of image formats, including PNG, JPG, and more.
- *High-Quality Results*: Generates high-quality output with smooth object edges.
- *Fast Processing*: Quickly processes images to save you time.
- *Customizable*: Adjust the settings to meet your specific background removal needs.

#### Installation

You can install rembg via pip:

```bash
pip install rembg
```
### Object Detection with OpenCV (cv2)

*OpenCV, also known as **cv2* in Python, is a powerful open-source computer vision library that provides a wide range of tools and functions for object detection and image processing. Whether you're building computer vision applications, object recognition systems, or simply exploring image analysis, OpenCV is a versatile choice.

#### Features

- *Pre-Trained Models:* Utilize pre-trained deep learning models for object detection, such as YOLO, SSD, and more.

- *Custom Object Detection:* Train your own object detection models on custom datasets.

- *Real-Time Detection:* Achieve real-time object detection and tracking in videos and camera streams.

- *Extensive Image Processing:* Perform image pre-processing, filtering, and feature extraction for better detection results.

#### Installation

OpenCV (cv2) can be installed using pip:

```bash
pip install opencv-python
```

### CLIP Overview 
CLIP (Contrastive Language-Image Pretraining) is a deep learning model developed by OpenAI, capable of understanding images and text simultaneously. It enables a wide range of applications, including image search, zero-shot classification, and more.


### CLIP Feature Extractor

The CLIP Feature Extractor is a crucial component responsible for processing image data. It extracts meaningful features from images, encoding them into numerical representations that can be used for downstream tasks. This component utilizes a convolutional neural network (CNN) architecture, such as a vision transformer (ViT), to extract these features effectively.

![image](https://github.com/cse200001043/Trendflix/assets/85782674/01a58501-544c-47ef-9b07-f1a9111923dc)

### CLIP Processor

The CLIP Processor is a key part of CLIP's text-image interaction. It prepares the text and image inputs for the CLIP Model. The processor performs the following tasks:

- Tokenization: It breaks down text into tokens and encodes them into numerical vectors.
- Image Preprocessing: For images, it resizes and normalizes them, preparing them for feature extraction.
- Text and Image Pairing: This ensures that the text and image inputs are properly aligned for meaningful comparison.

### CLIP Model

The CLIP Model combines the power of the extracted image features and text embeddings to perform various tasks. The model learns to understand the relationships between images and text through a contrastive loss function, where positive pairs (matching images and text) are encouraged to have high similarity, while negative pairs (non-matching images and text) have low similarity.

- **Image-Text Matching:** Given an image and a text description, the CLIP Model calculates the similarity score. It measures how well the text and image correspond to each other, enabling applications like image search and zero-shot classification.

- **Zero-Shot Learning:** CLIP can be used to classify images and texts into categories it has never seen during training, making it a powerful tool for a wide range of applications.

- **Multimodal Retrieval:** It allows you to search for images based on textual queries or vice versa, bridging the gap between text and image understanding.

In summary, CLIP leverages the CLIP Feature Extractor, CLIP Processor, and CLIP Model to enable a new level of interaction and understanding between text and images. This makes it a versatile tool for various AI tasks, including image search, natural language understanding, and more.` 
# Getting Started

Our project is organized into three primary components, each with its distinct role and functionality:

1. **Client**: The client component handles the user interface and user interaction. It includes web applications that users interact with to access and utilize the services provided by this project.

2. **Server**: The server component serves as the backend infrastructure of the project. It receives and processes requests from clients, performs computations, manages data, and handles the business logic of the application. The server is responsible for ensuring the project's functionality and availability.

3. **Datamind**: The Datamind component is responsible for running the machine learning (ML) code used in this project, written in Python. This component performs data analysis, training ML models, and generating insights based on the provided data. It plays a crucial role in data-driven decision-making and enhancing the project's capabilities.


### Installation
### 1. Client

To install the client, run the following command:

```bash
cd client
npm install
```

### 2. Server

To install the server, run the following command:

```bash
cd server
npm install
```

### 3. DataMind

To install the ML model, run the following command:

```bash
cd DataMind
pip install -r requirements.txt
```

# Preprocessing

This part contains scripts and instructions for preprocessing images to create a database for image matching.

```bash
cd Datamind
cd ImageMatching
mkdir Images
py ./MakeDatabase.py
py ./Preprocessing.py
```
Note: Only required when the database is updated, no need to do it if using the same database from this repository as it is already saved in the files.

## Usage
### 1. Client

To run the client, run the following command:

```bash
cd Client
npm start
```

### 2. Server

To run the server, run the following command:

```bash
cd Server
npm start
```
Wait till it says, "Server is listening on port 5000"

### 3. DataMind

To run the ML model, run the following command:

```bash
cd DataMind
py ./main.py
```



## Model Pipelining

- **Input Image:**
![captured_frame](https://github.com/cse200001043/Trendflix/assets/85782674/350eb5ce-a019-493c-a19f-f29aa34ee851=30X20)

- **Background Removal:**
``` python
from rembg import remove
from PIL import Image

input = Image.open(inputPath)
output = remove(input)
output.save(outputPath)
```
![output0](https://github.com/cse200001043/Trendflix/assets/85782674/7ed3e8de-b7a0-4b49-99a8-a720c37888b5)

- **Object Detection:**
``` python
import cv2
import numpy as np
import os

input_image = cv2.imread(imagePath, cv2.IMREAD_UNCHANGED)
height = input_image.shape[0]
width = input_image.shape[1]
if len(input_image.shape) == 2:
    gray_input_image = input_image.copy()
else:
    gray_input_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
upper_threshold, thresh_input_image = cv2.threshold(gray_input_image, thresh=0, maxval=255, type=cv2.THRESH_BINARY + cv2.THRESH_OTSU)
lower_threshold = 0.5 * upper_threshold
canny = cv2.Canny(input_image, lower_threshold, upper_threshold)
pts = np.argwhere(canny > 0)
y1, x1 = pts.min(axis=0)
y2, x2 = pts.max(axis=0)
output_image = input_image[y1:y2, x1:x2]
```
![output0](https://github.com/cse200001043/Trendflix/assets/85782674/107585af-fa6e-4dad-ac9c-67a3ebd11827)

- **Face-Blurring:**
``` python
import cv2
import numpy as np

input_image = cv2.imread(imagePath)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
gray_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=4, minSize=(5, 5))
mask = np.zeros_like(input_image)
for (x, y, w, h) in faces:
    face_region = input_image[y:y+h, x:x+w]
    face_region = cv2.GaussianBlur(face_region, (99, 99), 30)
    input_image[y:y+h, x:x+w] = face_region
result_image = cv2.bitwise_or(input_image, mask)
```
![output0](https://github.com/cse200001043/Trendflix/assets/85782674/c06690c8-f0ff-4493-b23d-db900e596731)

- **Image Search:**
```python
# Sample code snippet
from transformers import CLIPProcessor, CLIPModel
import torch

# Load the pre-trained CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")

# Prepare text and image inputs
text_input = ["a photo of a cat", "a dog in the park"]
image_input = [path_to_image_1, path_to_image_2]  # Replace with actual file paths

# Encode the inputs
inputs = processor(text_input, images=image_input, return_tensors="pt", padding=True)

# Get the model's output
with torch.no_grad():
    output = model(**inputs)

# Extract the similarity scores
similarity_scores = output.logits_per_image
print(similarity_scores)
```
![image](https://github.com/cse200001043/Trendflix/assets/85782674/fea2ca9b-51b3-4870-adce-8dca02a9f820)







## Project Overview
- **Home Page:** To use the Trendflix project, users are required to register first. After registration, they will be prompted to complete a form to specify their movie preferences. Based on these details, users will receive movie recommendations tailored to their preferences, and they can select a movie to watch. This contains the movies from our database that is built using TMDB database API. Below is the project's homepage, which includes the mentioned features.
![image](https://github.com/cse200001043/Trendflix/assets/85782674/406c494a-edd5-4517-b380-03f17a7ed0ed)

- **Movie Info Page:** This page provides detailed information about a specific movie, including its cast, genre, duration, and more. You can also watch the movie's trailer here. When you pause the movie, a pop-up will appear displaying the costumes worn by the actors in the paused frame. This pop-up will show matching costumes from our database, which we have compiled by scraping Amazon product data using the Beautiful Soup web scraper. It will display the most closely matched costumes in the window.
![image](https://github.com/cse200001043/Trendflix/assets/85782674/c6f50693-9fef-4334-8a0e-4f7b87000e5b)

- **Results Page:** The final page displays the dresses predicted by the model as the best-matched options. It includes images of the products, their prices, ratings, and a shopping link that directs you to the respective Amazon product page for purchasing.
![image](https://github.com/cse200001043/Trendflix/assets/85782674/d3fcb947-3cde-4c09-aee8-78a34eb0ec8b)

- **Amazon Links:** This is the Amazon link for one of the results generated by the ML model, providing the ultimate shopping destination.
![image](https://github.com/cse200001043/Trendflix/assets/85782674/037ab99d-ad69-4897-9a38-1a5017e7c99b)
https://www.amazon.in//AKHILAM-Womens-Design-Unstitched-2PAKHI41_Parent/dp/B0BXPBJQWV?th=1
