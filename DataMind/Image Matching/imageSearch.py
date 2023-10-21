from PIL import Image
import requests
from transformers import AutoProcessor, CLIPModel
import torch
from transformers import CLIPProcessor, CLIPModel, CLIPFeatureExtractor
from PIL import Image
import os
import pickle


# Load the CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")
print("2\n")

# Specify the path to the folder containing your images
folder_path = 'Images'

# Initialize an empty list to store the image file paths
image_paths = []

# Iterate through the files in the folder and add image file paths to the list
for filename in os.listdir(folder_path):
    if filename.endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp')):  # Add more image file extensions as needed
        image_path = os.path.join(folder_path, filename)
        image_paths.append(image_path)
print("3\n")

# Now, the image_paths list contains the file paths of all the images in the specified folder

database_embeddings = []
database_metadata = []  # This can be a list of file paths or labels

for image_path in image_paths:
    image = Image.open(image_path)
    inputs = processor(images=image, return_tensors="pt")
    image_embedding = model.get_image_features(**inputs)
    # image_embedding = model(**inputs).image_features  # Retrieve the pixel values
    database_embeddings.append(image_embedding)
    database_metadata.append(image_path)  # or any other relevant metadata

print("4\n")

# Save database_embeddings and metadata
with open('database_embeddings.pkl', 'wb') as f:
    pickle.dump({'embeddings': database_embeddings, 'metadata': database_metadata}, f)
print("5\n")

# Load database_embeddings and metadata
with open('database_embeddings.pkl', 'rb') as f:
    saved_data = pickle.load(f)
    loaded_database_embeddings = saved_data['embeddings']
    loaded_database_metadata = saved_data['metadata']
print("6\n")

def get_best_match(img_number):
  # Load and preprocess the user's query image
  # user_query_image_path = '/content/drive/MyDrive/Images/'+img_number+'.jpg'
  user_query_image_path = '../Wearable/output0.png'

  user_query_image = Image.open(user_query_image_path)

  inputs = processor(images=user_query_image, return_tensors="pt")
  user_query_embedding = model.get_image_features(**inputs)

  # Calculate similarities between the user query and database images
  similarities = []
  # print(database_embeddings)
  for image_embedding in database_embeddings:
      similarity = torch.nn.functional.cosine_similarity(user_query_embedding, image_embedding)
      similarities.append(similarity.item())

  # print(similarities)
  # Rank and return the top matching images
  top_matches = sorted(range(len(similarities)), key=lambda i: similarities[i], reverse=True)
  print(len(top_matches))

  for idx in top_matches[:3]:
      print(f"{img_number} Image: {database_metadata[idx]}, Similarity: {similarities[idx]}")
      
for i in range (200):
  print(get_best_match(str(i)))