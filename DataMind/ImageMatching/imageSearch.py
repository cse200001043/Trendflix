from PIL import Image
from transformers import AutoProcessor, CLIPModel
import torch
from transformers import CLIPModel
from PIL import Image
import pickle
from transformers import CLIPModel


def get_best_match():
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")

    ImageData = []
    with open(f"ImageMatching/ImageData.pkl", 'rb') as f:
        saved_data = pickle.load(f)
        ImageData = saved_data['embeddings']

    print("Loaded Preprocessed Data\n---------------------------------------------------\n")

    user_query_image_path = 'Wearable/output0.png'
    user_query_image = Image.open(user_query_image_path)

    inputs = processor(images=user_query_image, return_tensors="pt")
    user_query_embedding = model.get_image_features(**inputs)

    database_metadata = []
    similarities = []
    img_count = 0
    print("Image processed\n----------------------------------------------------------\n")

    for i in range(1, 11):
        with open(f"ImageMatching/database_embeddings{i}.pkl", 'rb') as f:
            saved_data = pickle.load(f)
            database_embeddings = saved_data['embeddings']
            database_metadata1 = saved_data['metadata']
            for data in database_metadata1:
                database_metadata.append(data)

            for image_embedding in database_embeddings:
                similarity = torch.nn.functional.cosine_similarity(
                    user_query_embedding, image_embedding)
                similarities.append(similarity.item())
                img_count = img_count + 1

    top_matches = sorted(range(len(similarities)),
                         key=lambda i: similarities[i], reverse=True)
    print(len(top_matches))

    results = []
    for idx in top_matches[:3]:
        results.append({
            "Image": database_metadata[idx],
            "Similarity": similarities[idx],
            "ImageData": ImageData[idx]
        })

    return results


# if __name__ == "__main__":
#     get_best_match()
