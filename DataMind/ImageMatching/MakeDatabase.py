import os
import json
import requests
from PIL import Image
from io import BytesIO
import pickle


folder_path = '../Data/'
file_names = os.listdir(folder_path)

def extract_image_urls(jsonl_file_path):
    # Create an empty list to store the extracted data
    data_list = []
    # Open the JSONL file and process each line
    count = 0
    with open(jsonl_file_path, 'r') as file:
        for line in file:
            count = count+1
            # Parse each line as JSON
            try:
                data = json.loads(line)
                data_list.append(data)
            except json.JSONDecodeError:
                print(f"{count}Error parsing JSON in line: {line}")
    return data_list

file_image_data = []
for file in file_names:
    print(file)
    file_data = extract_image_urls("../Data/" + file)
    for image in file_data:
        file_image_data.append(image)
    print(len(file_image_data))

with open(f"ImageData.pkl", 'wb') as f:
    pickle.dump({'embeddings': file_image_data}, f)

def download_image_from_url(image_url, local_file_path):
    # Send an HTTP GET request to the URL
    response = requests.get(image_url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Read the image content from the response
        image_data = response.content

        # Create an image object from the image data
        image = Image.open(BytesIO(image_data))

        image.save(local_file_path)
        print(f"Image downloaded and saved as {local_file_path}")
    else:
        print(
            f"Failed to download the image. Status code: {response.status_code}")


for iter in range(len(file_image_data)):
    url = file_image_data[iter]['img_src'][0]
    download_image_from_url(url, "Images/" + str(iter) + ".jpg")