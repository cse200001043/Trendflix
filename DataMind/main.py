from flask import request, json, Flask
import pandas as pd
import numpy as np
import pymongo
from fuzzywuzzy import process
from flask_cors import CORS
import Movie_recommendation_code as file1
from FrameToObjects import mainRun as frameToObjectsModel
from ImageMatching import imageSearch as ImageSearch
import ast

import base64
import re
from io import BytesIO
from PIL import Image


app = Flask(__name__)
CORS(app)
client = pymongo.MongoClient(
    "mongodb+srv://hackOnAmazon:hackOnAmazon@cluster0.ges8hgp.mongodb.net/Trendflix?retryWrites=true&w=majority")
dataset_collection = client['Trendflix']['Dataset']
dataset_list = list(dataset_collection.find())
df = pd.DataFrame(dataset_list)

pre_dataset_collection = client['Trendflix']['Pre_dataset']
pre_dataset_list = list(pre_dataset_collection.find())
pre_df = pd.DataFrame(pre_dataset_list)

user_collection = client['Trendflix']['users']
user_list = list(user_collection.find())
similarity, similarity_genre, similarity_cast = file1.vectorization(pre_df)


def genre_func(genre_name, df):
    df1 = df.sort_values(by=['count'], ascending=False)
    df_list = []

    for idx, row in df1.iterrows():
        for j in row['genre']:
            if j == genre_name:
                m_id = row['movie_id']
                m_name = row['movie_title']
                m_image = row['poster_image']
                df_list.append(
                    {'movie_id': m_id, 'name': m_name, 'image': m_image})
                if (len(df_list) == 30):
                    return df_list
                break
    return df_list


def top_rated(df, count1):
    new_df = df.sort_values(by=['rating'], ascending=False)
    movie_list = []

    for idx, row in new_df.iterrows():
        m_id = row['movie_id']
        m_name = row['movie_title']
        m_image = row['poster_image']
        movie_list.append({'movie_id': m_id, 'name': m_name, 'image': m_image})
        if (len(movie_list) == count1):
            break

    return movie_list


def trending(df, count1):
    new_df = df.sort_values(by=['count'], ascending=False)
    movie_list = []

    for idx, row in new_df.iterrows():
        m_id = row['movie_id']
        m_name = row['movie_title']
        m_image = row['poster_image']
        movie_list.append({'movie_id': m_id, 'name': m_name, 'image': m_image})
        if (len(movie_list) == count1):
            break

    return movie_list


def country_movies(df, country, count1):
    new_df = df.sort_values(by=['count'], ascending=False)
    movie_list = []

    for idx, row in new_df.iterrows():
        if (row['country'] == country):
            m_id = row['movie_id']
            m_name = row['movie_title']
            m_image = row['poster_image']
            movie_list.append(
                {'movie_id': m_id, 'name': m_name, 'image': m_image})
            if (len(movie_list) == count1):
                break

    return movie_list


def language_genre(df, lang_list, genre_list):
    new_df = df.sort_values(by=['count'], ascending=False)
    movie_list = []
    count1 = 30//len(lang_list)
    for i in lang_list:
        cnt = 0
        for idx, row in new_df.iterrows():
            if (row['language'] == i):
                flag = 0
                for j in genre_list:
                    for k in row['genre']:
                        if k == j:
                            m_id = row['movie_id']
                            m_name = row['movie_title']
                            m_image = row['poster_image']
                            movie_list.append(
                                {'movie_id': m_id, 'name': m_name, 'image': m_image})
                            flag = 1
                            cnt = cnt+1
                        if (flag == 1):
                            break
                    if (flag == 1):
                        break
            if (cnt == count1):
                break

    return movie_list


@app.route("/liked", methods=['POST'])
def getLikedMovies():
    user_id = request.get_json().get('user_id')

    for i in user_list:
        if (str(i['_id']) == user_id):
            liked_movies = i['likedMoviesId']

    movie_data = []
    for i in liked_movies:
        for j in dataset_list:
            if (str(j['movie_id']) == i):
                m_id = j['movie_id']
                m_name = j['movie_title']
                m_image = j['poster_image']
                movie_data.append(
                    {'movie_id': m_id, 'name': m_name, 'image': m_image})

    return json.dumps({'liked_movies': {'title': 'Liked Movies', 'data': movie_data}}, default=str)


@app.route("/change", methods=['GET'])
def changeUserData():
    global user_collection
    global user_list
    new_user_collection = client['Trendflix']['users']
    new_user_list = list(new_user_collection.find())

    user_collection = new_user_collection
    user_list = new_user_list

    return json.dumps({"success": "true"}, default=str)


@app.route("/count", methods=['POST'])
def changeCount():
    global dataset_collection
    global dataset_list
    global df

    movie_id = request.get_json().get('movie_id')
    movie_id = int(movie_id)

    for i in dataset_list:
        if (i['movie_id'] == movie_id):
            movie_details = i
            break
    movie_details['count'] = movie_details['count']+1

    dataset_collection.replace_one({'movie_id': movie_id}, movie_details)
    new_dataset_list = list(dataset_collection.find())
    new_df = pd.DataFrame(new_dataset_list)

    dataset_list = new_dataset_list
    df = new_df

    return json.dumps({"success": "true"}, default=str)


@app.route("/home", methods=['GET'])
def func():
    top_rated_data = top_rated(df, 30)
    popular_data = trending(df, 30)
    comedy_data = genre_func("Comedy", df)
    adventure_data = genre_func("Adventure", df)
    action_data = genre_func("Action", df)

    data = [{'title': 'Trending Movies', 'data': popular_data}, {'title': 'Top Rated Movies', 'data': top_rated_data}, {
        'title': 'Comedy Movies', 'data': comedy_data}, {'title': 'Adventure Movies', 'data': adventure_data}, {'title': 'Action Movies', 'data': action_data}]
    return json.dumps({"data": data}, default=str)


@app.route("/userid", methods=['POST'])
def func1():
    user_id = request.get_json().get('user_id')
    watched_movies = 0

    for i in user_list:
        if (str(i['_id']) == user_id):
            watched_movies = i['previouslyWatched']
            liked_movies = i['likedMoviesId']
            country = i['country']
            lang_list = i['languages']
            genre_list = i['favGenres']
            break

    if (len(watched_movies) == 0 and len(liked_movies) == 0):
        top_rated_data = top_rated(df, 20)
        popular_data = trending(df, 20)
        country_data = country_movies(df, country, 20)
        language_data = language_genre(df, lang_list, genre_list)

        data = [
            {'title': 'Recommended For You', 'data': language_data},
            {'title': 'Popular In Your Country', 'data': country_data},
            {'title': 'Top Rated Movies', 'data': top_rated_data},
            {'title': 'Trending Movies', 'data': popular_data}
        ]

        return json.dumps({"data": data}, default=str)

    else:
        watched_movies = watched_movies+liked_movies
        watched_movies = list(set(watched_movies))
        recommended_genre_list = []
        recommended_cast_list = []
        recommended_overall_list = []
        top_rated_data = top_rated(df, 20)
        popular_data = trending(df, 20)
        country_data = country_movies(df, country, 20)
        language_data = language_genre(df, lang_list, genre_list)

        if len(watched_movies) < 5:
            cnt = 20//len(watched_movies)
            for i in watched_movies:
                movie_obj = file1.recommend_movies(
                    i, cnt, pre_df, similarity, similarity_genre, similarity_cast)
                recommended_genre_list = recommended_genre_list + \
                    movie_obj['genre_based']
                recommended_cast_list = recommended_cast_list + \
                    movie_obj['cast_based']
                recommended_overall_list = recommended_overall_list + \
                    movie_obj['all_feature']

        else:
            cnt = 6
            for i in watched_movies:
                movie_obj = file1.recommend_movies(
                    i, cnt, pre_df, similarity, similarity_genre, similarity_cast)
                recommended_genre_list = recommended_genre_list + \
                    movie_obj['genre_based']
                recommended_cast_list = recommended_cast_list + \
                    movie_obj['cast_based']
                recommended_overall_list = recommended_overall_list + \
                    movie_obj['all_feature']
                cnt = cnt-1
                if (cnt == 1):
                    break

        recommended_genre_data = []
        recommended_cast_data = []
        recommended_overall_data = []

        for i in recommended_genre_list:
            for j in dataset_list:
                if (j['movie_id'] == i):
                    m_id = j['movie_id']
                    m_name = j['movie_title']
                    m_image = j['poster_image']
                    break
            recommended_genre_data.append(
                {'movie_id': m_id, 'name': m_name, 'image': m_image})

        for i in recommended_cast_list:
            for j in dataset_list:
                if (j['movie_id'] == i):
                    m_id = j['movie_id']
                    m_name = j['movie_title']
                    m_image = j['poster_image']
                    break
            recommended_cast_data.append(
                {'movie_id': m_id, 'name': m_name, 'image': m_image})

        for i in recommended_overall_list:
            for j in dataset_list:
                if (j['movie_id'] == i):
                    m_id = j['movie_id']
                    m_name = j['movie_title']
                    m_image = j['poster_image']
                    break
            recommended_overall_data.append(
                {'movie_id': m_id, 'name': m_name, 'image': m_image})

    data = [
        {'title': 'Recommended For You', 'data': recommended_overall_data},
        {'title': 'Recommended By Genre', 'data': recommended_genre_data},
        {'title': 'Recommended By Cast', 'data': recommended_cast_data},
        {'title': 'Popular In Your Country', 'data': country_data},
        {'title': 'Popular In Your Language', 'data': language_data},
        {'title': 'Top Rated Movies', 'data': top_rated_data},
        {'title': 'Trending Movies', 'data': popular_data}
    ]

    return json.dumps({"data": data}, default=str)


@app.route("/movieid", methods=['POST'])
def func2():
    movie_id = request.get_json().get('movie_id')
    movie_id = int(movie_id)

    recommended_list = file1.similar_movies(movie_id, 16, pre_df, similarity)
    recommended_list = [x for x in recommended_list[1:]]
    movie_data = []
    for i in dataset_list:
        if (i['movie_id'] == movie_id):
            movie_data.append(i)
            break

    recommended_data = []
    for i in recommended_list:
        for j in dataset_list:
            if (j['movie_id'] == i):
                m_id = j['movie_id']
                m_name = j['movie_title']
                m_image = j['poster_image']
                break
        recommended_data.append(
            {'movie_id': m_id, 'name': m_name, 'image': m_image})
    return json.dumps({'movie_data': movie_data, 'recommended': recommended_data}, default=str)


@app.route("/category", methods=['POST'])
def func3():
    category = request.get_json().get('category')

    movie_data = []

    if (category == "top_rated"):

        movie_data = top_rated(df, 50)

    elif (category == "popular"):

        movie_data = trending(df, 50)

    else:
        genre_list = ['Crime', 'Comedy', 'Adventure', 'Action', 'ScienceFiction', 'Animation', 'Family', 'Drama', 'Romance',
                      'Mystery', 'Fantasy', 'Thriller', 'War', 'Western', 'History', 'Horror', 'Music', 'TVMovie', 'Documentary']

        for i in genre_list:
            if (i == category):
                movie_data = genre_func(category, df)
                break

    return json.dumps({'movie_data': movie_data}, default=str)


@app.route("/search", methods=['POST'])
def func4():
    movie_name = request.get_json().get('movie_name')

    movies_list = pre_df['movie_title']
    movie_name = process.extractOne(movie_name, movies_list)[0]
    movie_id = df[df['movie_title'] == movie_name].iloc[0]
    movie_id = movie_id['movie_id']

    movies_list = file1.similar_movies(movie_id, 50, pre_df, similarity)

    movies_data = []
    for i in movies_list:
        for j in dataset_list:
            if (j['movie_id'] == i):
                m_id = j['movie_id']
                m_name = j['movie_title']
                m_image = j['poster_image']
                break
        movies_data.append(
            {'movie_id': m_id, 'name': m_name, 'image': m_image})

    return json.dumps({'movie_data': movies_data}, default=str)


@app.route("/all", methods=['GET'])
def func5():
    # dataset_list=list(dataset_collection.find())

    all_data = []
    cnt = 0
    for i in dataset_list:
        m_id = i['movie_id']
        m_name = i['movie_title']
        m_image = i['poster_image']
        all_data.append({'movie_id': m_id, 'name': m_name, 'image': m_image})
        cnt = cnt+1
        if (cnt == 100):
            break

    return json.dumps({'all_movies': all_data}, default=str)


# update in mongodb
@app.route("/addmovie", methods=['POST'])
def func6():
    global dataset_collection
    global dataset_list
    global df
    global pre_dataset_collection
    global pre_dataset_list
    global pre_df
    global similarity
    global similarity_genre
    global similarity_cast
    movie_info = request.get_json().get('movie_details')

    movie_id = 0
    for i in dataset_list:
        if (i['movie_id'] > movie_id):
            movie_id = i['movie_id']
    movie_id = movie_id+1
    movie_title = movie_info["movie_title"]
    overview = movie_info["overview"]
    genre = movie_info["genre"]
    release_date = movie_info["release_date"]
    runtime = movie_info["runtime"]
    Director = movie_info["director"]
    Writer = movie_info["writer"]
    Cast = []
    for i in movie_info["cast"]:
        Cast.append(
            {"name": i["actorName"], "character": i["character"], "image": i["imageUrl"]})
    tagline = movie_info["tagline"]
    poster_image = movie_info["poster_image"]
    background_image = movie_info["background_image"]
    language = movie_info["language"][0]
    country = movie_info["country"]
    rating = movie_info["rating"]
    if (movie_info["A_rated"] == "Yes"):
        A_rated = True
    else:
        A_rated = False
    trailer = movie_info["trailer"]
    count = movie_info["count"]

    movie_details = {
        "movie_id": movie_id,
        "movie_title": movie_title,
        "overview": overview,
        "genre": genre,
        "release_date": release_date,
        "runtime": runtime,
        "Director": Director,
        "Writer": Writer,
        "Cast": Cast,
        "tagline": tagline,
        "poster_image": poster_image,
        "background_image": background_image,
        "language": language,
        "country": country,
        "rating": rating,
        "A-rated": A_rated,
        "trailer": trailer,
        "count": count
    }

    dataset_collection.insert_one(movie_details)
    new_dataset_list = list(dataset_collection.find())
    new_df = pd.DataFrame(new_dataset_list)
    dataset_list = new_dataset_list
    df = new_df
    print("added to dataset")

    movie_details1 = []
    movie_details1.append(movie_details)
    one_row_df = pd.DataFrame(movie_details1)

    pre_movie_details_df = file1.preprocess_dataset(one_row_df)
    for idx, row in pre_movie_details_df.iterrows():
        first_row = row
        break

    pre_movie_details = {'movie_id': first_row['movie_id'],
                         'movie_title': first_row['movie_title'],
                         'overview': first_row['overview'],
                         'genre': first_row['genre'],
                         'release_date': first_row['release_date'],
                         'runtime': first_row['runtime'],
                         'Director': first_row['Director'],
                         'Writer': first_row['Writer'],
                         'Cast': first_row['Cast'],
                         'tagline': first_row['tagline'],
                         'poster_image': first_row['poster_image'],
                         'background_image': first_row['background_image'],
                         'language': first_row['language'],
                         'country': first_row['country'],
                         'rating': first_row['rating'],
                         'A-rated': first_row['A-rated'],
                         'trailer': first_row['trailer'],
                         'count': first_row['count'],
                         'tags': first_row['tags'],
                         'tag_genre': first_row['tag_genre'],
                         'tag_cast': first_row['tag_cast']}

    pre_dataset_collection.insert_one(pre_movie_details)
    new_pre_dataset_list = list(pre_dataset_collection.find())
    new_pre_df = pd.DataFrame(new_pre_dataset_list)
    pre_dataset_list = new_pre_dataset_list
    pre_df = new_pre_df
    print("added to pre_dataset")
    new_similarity, new_similarity_genre, new_similarity_cast = file1.vectorization(
        pre_df)
    similarity = new_similarity
    similarity_genre = new_similarity_genre
    similarity_cast = new_similarity_cast

    reversed_list = dataset_list[::-1]
    all_data = []
    cnt = 0
    for i in reversed_list:
        m_id = i['movie_id']
        m_name = i['movie_title']
        m_image = i['poster_image']
        all_data.append({'movie_id': m_id, 'name': m_name, 'image': m_image})
        cnt = cnt+1
        if (cnt == 100):
            break

    data = [{'title': 'All Movies', 'data': all_data}]
    return json.dumps({'data': data}, default=str)


@app.route("/updatemovie", methods=['POST'])
def func7():
    global dataset_collection
    global dataset_list
    global df
    global pre_dataset_collection
    global pre_dataset_list
    global pre_df
    global similarity
    global similarity_genre
    global similarity_cast
    movie_info = request.get_json().get('movie_details')

    movie_id = movie_info["movie_id"]
    movie_title = movie_info["movie_title"]
    overview = movie_info["overview"]
    genre = movie_info["genre"]
    release_date = movie_info["release_date"]
    runtime = movie_info["runtime"]
    Director = movie_info["director"]
    Writer = movie_info["writer"]
    Cast = []
    for i in movie_info["cast"]:
        Cast.append(
            {"name": i["actorName"], "character": i["character"], "image": i["imageUrl"]})
    tagline = movie_info["tagline"]
    poster_image = movie_info["poster_image"]
    background_image = movie_info["background_image"]
    language = movie_info["language"][0]
    country = movie_info["country"]
    rating = movie_info["rating"]
    if (movie_info["A_rated"] == "Yes"):
        A_rated = True
    else:
        A_rated = False
    trailer = movie_info["trailer"]
    count = movie_info["count"]

    movie_details = {
        "movie_id": movie_id,
        "movie_title": movie_title,
        "overview": overview,
        "genre": genre,
        "release_date": release_date,
        "runtime": runtime,
        "Director": Director,
        "Writer": Writer,
        "Cast": Cast,
        "tagline": tagline,
        "poster_image": poster_image,
        "background_image": background_image,
        "language": language,
        "country": country,
        "rating": rating,
        "A-rated": A_rated,
        "trailer": trailer,
        "count": count
    }

    dataset_collection.replace_one(
        {'movie_id': movie_details["movie_id"]}, movie_details)
    new_dataset_list = list(dataset_collection.find())
    new_df = pd.DataFrame(new_dataset_list)
    dataset_list = new_dataset_list
    df = new_df

    movie_details1 = []
    movie_details1.append(movie_details)
    one_row_df = pd.DataFrame(movie_details1)

    pre_movie_details_df = file1.preprocess_dataset(one_row_df)
    for idx, row in pre_movie_details_df.iterrows():
        first_row = row
        break

    pre_movie_details = {'movie_id': first_row['movie_id'],
                         'movie_title': first_row['movie_title'],
                         'overview': first_row['overview'],
                         'genre': first_row['genre'],
                         'release_date': first_row['release_date'],
                         'runtime': first_row['runtime'],
                         'Director': first_row['Director'],
                         'Writer': first_row['Writer'],
                         'Cast': first_row['Cast'],
                         'tagline': first_row['tagline'],
                         'poster_image': first_row['poster_image'],
                         'background_image': first_row['background_image'],
                         'language': first_row['language'],
                         'country': first_row['country'],
                         'rating': first_row['rating'],
                         'A-rated': first_row['A-rated'],
                         'trailer': first_row['trailer'],
                         'count': first_row['count'],
                         'tags': first_row['tags'],
                         'tag_genre': first_row['tag_genre'],
                         'tag_cast': first_row['tag_cast']}

    pre_dataset_collection.replace_one(
        {'movie_id': pre_movie_details['movie_id']}, pre_movie_details)
    new_pre_dataset_list = list(pre_dataset_collection.find())
    new_pre_df = pd.DataFrame(new_pre_dataset_list)
    pre_dataset_list = new_pre_dataset_list
    pre_df = new_pre_df
    print("added to pre_dataset")
    new_similarity, new_similarity_genre, new_similarity_cast = file1.vectorization(
        pre_df)
    similarity = new_similarity
    similarity_genre = new_similarity_genre
    similarity_cast = new_similarity_cast

    reversed_list = dataset_list[::-1]
    all_data = []
    cnt = 0
    for i in reversed_list:
        m_id = i['movie_id']
        m_name = i['movie_title']
        m_image = i['poster_image']
        all_data.append({'movie_id': m_id, 'name': m_name, 'image': m_image})
        cnt = cnt+1
        if (cnt == 100):
            break

    data = [{'title': 'All Movies', 'data': all_data}]
    return json.dumps({'data': data}, default=str)


@app.route("/deletemovie", methods=['POST'])
def func8():
    global dataset_collection
    global dataset_list
    global df
    global pre_dataset_collection
    global pre_dataset_list
    global pre_df
    global similarity
    global similarity_genre
    global similarity_cast
    movie_id = request.get_json().get('movie_id')

    dataset_collection.delete_one({'movie_id': movie_id})
    new_dataset_list = list(dataset_collection.find())
    new_df = pd.DataFrame(new_dataset_list)
    dataset_list = new_dataset_list
    df = new_df

    pre_dataset_collection.delete_one({'movie_id': movie_id})
    new_pre_dataset_list = list(pre_dataset_collection.find())
    new_pre_df = pd.DataFrame(new_pre_dataset_list)
    pre_dataset_list = new_pre_dataset_list
    pre_df = new_pre_df
    print("deleted from pre_dataset")
    new_similarity, new_similarity_genre, new_similarity_cast = file1.vectorization(
        pre_df)
    similarity = new_similarity
    similarity_genre = new_similarity_genre
    similarity_cast = new_similarity_cast

    reversed_list = dataset_list[::-1]
    all_data = []
    cnt = 0
    for i in reversed_list:
        m_id = i['movie_id']
        m_name = i['movie_title']
        m_image = i['poster_image']
        all_data.append({'movie_id': m_id, 'name': m_name, 'image': m_image})
        cnt = cnt+1
        if (cnt == 100):
            break

    data = [{'title': 'All Movies', 'data': all_data}]
    return json.dumps({'data': data}, default=str)


@app.route("/amazon_products", methods=['POST'])
def func9():
    frameDataUrl = request.get_json().get('frameDataUrl')
    print(type(frameDataUrl))

    # Extract the base64 data from the Data URL
    image_data = re.sub('^data:image/.+;base64,', '', frameDataUrl)
    # Decode the base64 data
    image_binary = base64.b64decode(image_data)
    # Create an image object from the binary data
    image = Image.open(BytesIO(image_binary))
    image = image.convert('RGB')

    # Save the image to a file
    image.save('input/captured_frame.jpeg', 'jpeg')
    print("Image Saved\n------------------------------------------------------------\n", image)
    frameToObjectsModel.main()
    result = ImageSearch.get_best_match()

    return json.dumps({"productLinks": result}, default=str)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
