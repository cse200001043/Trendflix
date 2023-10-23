


# TrendFlix

TrendFlix is a cutting-edge movie streaming platform that redefines the traditional streaming experience by seamlessly blending entertainment and fashion. Much like popular services such as Amazon Prime, TrendFlix offers a vast library of movies and TV shows for your viewing pleasure. However, what sets TrendFlix apart is its unique and innovative feature: the ability to display shopping links for products similar to the wearable items worn by your favorite movie stars.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Model Overview](#model-overview)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Introduction

### Machine Learning Algorithm for Movie Frames

Our machine learning algorithm for movie frames comprises four essential components, each serving a distinct purpose in enhancing and optimizing the visual and privacy aspects of the frames.

#### 1. Background Removal

Background removal is a critical step in isolating the primary subject or objects within each movie frame. By effectively eliminating the background, this component enhances the focus and clarity of the subject, resulting in visually appealing frames. We use the [Rembg](https://github.com/danielgatis/rembg) Library.

#### 2. Object Detection

Object detection, powered by [OpenCV (CV2)](https://opencv.org/), enables the automatic identification and localization of various objects within the movie frames. This component provides valuable insights into the composition of each frame, making it a versatile tool for analysis and enhancement.

#### 3. Face-Blurring

Face features form a significant part of the image, However we do not want the face of the celebrity to influence our search results. So we feed the image into new ML model that uses CV2 to blur the face.

#### 4. Image Search

At this step, we have a filtered image without any backround , without any facial features of film stars. The image is now used to search similiar products from our database. The image searc component has been implemented using [CLIP](https://openai.com/research/clip) by OpenAI.
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
echo pip install rembg
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

![clip](https://github.com/cse200001043/Trendflix/assets/87379004/84a72775-297b-41b2-a455-9600237ef787)


### CLIP Feature Extractor

The CLIP Feature Extractor is a crucial component responsible for processing image data. It extracts meaningful features from images, encoding them into numerical representations that can be used for downstream tasks. This component utilizes a convolutional neural network (CNN) architecture, such as a vision transformer (ViT), to extract these features effectively.

### CLIP Processor

The CLIP Processor is a key part of CLIP's text-image interaction. It prepares the text and image inputs for the CLIP Model. The processor performs the following tasks:

- Tokenization: It breaks down text into tokens and encodes them into numerical vectors.
- Image Preprocessing: For images, it resizes and normalizes them, preparing them for feature extraction.
- Text and Image Pairing: It ensures that the text and image inputs are properly aligned for meaningful comparison.

### CLIP Model

The CLIP Model combines the power of the extracted image features and text embeddings to perform various tasks. The model learns to understand the relationships between images and text through a contrastive loss function, where positive pairs (matching images and text) are encouraged to have high similarity, while negative pairs (non-matching images and text) have low similarity.

- **Image-Text Matching:** Given an image and a text description, the CLIP Model calculates the similarity score. It measures how well the text and image correspond to each other, enabling applications like image search and zero-shot classification.

- **Zero-Shot Learning:** CLIP can be used to classify images and texts into categories it has never seen during training, making it a powerful tool for a wide range of applications.

- **Multimodal Retrieval:** It allows you to search for images based on textual queries or vice versa, bridging the gap between text and image understanding.

In summary, CLIP leverages the CLIP Feature Extractor, CLIP Processor, and CLIP Model to enable a new level of interaction and understanding between text and images. This makes it a versatile tool for various AI tasks, including image search, natural language understanding, and more.` 
# Getting Started

### Prerequisites

[Explain what software and hardware prerequisites are needed for your project. Include information about any libraries or packages that should be installed.]

### Installation

[Provide detailed installation instructions for setting up the project. Include any specific version requirements or environment setup that is necessary.]

## Usage

[Explain how to use your project, especially how to interact with the OpenAI CLIP model. Include code examples and step-by-step guides to help users get started.]

## Model Overview

[Provide an overview of the OpenAI CLIP model from Hugging Face. Explain what the model is designed for and how it works. You can link to the official OpenAI CLIP documentation and Hugging Face model page for more details.]

- OpenAI CLIP Model: [Official OpenAI CLIP Documentation](https://openai.com/research/clip)
- Hugging Face Model Hub: [CLIP Model on Hugging Face](https://huggingface.co/models)

## Examples

[Show some code examples or usage scenarios that demonstrate how to use the OpenAI CLIP model in your project. Include both text and image inputs.]

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


