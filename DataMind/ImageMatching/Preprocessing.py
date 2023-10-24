from PIL import Image
from transformers import AutoProcessor, CLIPModel
from transformers import CLIPModel
from PIL import Image
import os
import pickle
import torch
from transformers import CLIPModel


def preprocess():
    # Load the CLIP model and processor
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")

    folder_path = 'Images'
    image_paths = []

    # Iterate through the files in the folder and add image file paths to the list
    for filename in os.listdir(folder_path):
        # Add more image file extensions as needed
        if filename.endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp')):
            image_path = os.path.join(folder_path, filename)
            image_paths.append(image_path)

    database_embeddings = []
    database_metadata = []  # This can be a list of file paths or labels

    img_count = 0
    for image_path in image_paths:
        img_count = img_count + 1
        print(img_count)
        try:
            image = Image.open(image_path)
            inputs = processor(images=image, return_tensors="pt")
            image_embedding = model.get_image_features(**inputs)
            # image_embedding = model(**inputs).image_features  # Retrieve the pixel values
            database_embeddings.append(image_embedding)
            # or any other relevant metadata
            database_metadata.append(image_path)

            if img_count % 300 == 0:
                with open(f"database_embeddings{int(img_count/300)}.pkl", 'wb') as f:
                    pickle.dump({'embeddings': database_embeddings,
                                'metadata': database_metadata}, f)
                database_embeddings = []
                database_metadata = []
                print(
                    f"Preprocessing of images from {img_count-299} to {img_count}\n")

        except Exception as e:
            # Code to handle the exception
            print(f"An exception of type {type(e).__name__} occurred: {e}")

    if (img_count % 300 != 0):
        with open(f"database_embeddings{int(img_count/300)+1}.pkl", 'wb') as f:
            pickle.dump({'embeddings': database_embeddings,
                        'metadata': database_metadata}, f)
        print(
            f"Preprocessing of images from {(int(img_count/300))*300+1} to {img_count}\n")


if __name__ == "__main__":
    preprocess()
