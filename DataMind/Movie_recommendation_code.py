import numpy as np
import pandas as pd
import ast
from nltk.stem.porter import PorterStemmer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
from sklearn.feature_extraction.text import TfidfVectorizer

ps = PorterStemmer()
vectorizer=TfidfVectorizer()


def stem(text):
    y=[]
    for i in text.split():
        y.append(ps.stem(i))
    
    return " ".join(y)

def convert(obj):
    L=[]
    for i in ast.literal_eval(obj):
        L.append(i['name'])
    return L

def convert1(obj):
    L=[]
    L.append(obj)
    return L

def convert2(obj):
    obj=ast.literal_eval(obj)
    return obj

def convert_director(obj):
    L=[]
    obj="["+obj+"]"
    for i in ast.literal_eval(obj):
        L.append(i['name'])
    return L

def convert_first_four(obj):
    L=[]
    j=0
    for i in obj:
        L.append(i['name'])
        j+=1
        if j==4:
            break
    return L

def preprocess_dataset(movies):
    movies.dropna(subset=["overview","country","Writer"],inplace=True)
    # movies.drop_duplicates(inplace=True)

    # converting into desired data type
    # movies['genre']=movies['genre'].apply(convert)
    movies['Director']=movies['Director'].apply(convert1)
    # if(type(movies['genre'][0])==str):
    #     movies['genre']=movies['genre'].apply(convert2)
    movies['Cast']=movies['Cast'].apply(convert_first_four)
    movies['overview']=movies['overview'].apply(lambda x:x.split())
    listt2=list(movies['language'])
    movies['language']=listt2

    # for i in range(0,movies['language'].shape[0]):
    #     movies['language'].iloc[i]=str(movies['language'].iloc[i])

    movies["language"]=movies["language"].apply(lambda x: list(x.split("#")))
    movies["Writer"]=movies["Writer"].apply(lambda x: list(x.split("#")))
    # movies["Director"]=movies["Director"].apply(lambda x: list(x.split("#")))
    movies["country"]=movies["country"].apply(lambda x: list(x.split("#")))

    # movies['genre']=movies['genre'].apply(lambda x:[i.replace(" ","") for i in x])
    print(movies['Director'])
    movies['Director']=movies['Director'].apply(lambda x:[i.replace(" ","") for i in x])
    movies['Cast']=movies['Cast'].apply(lambda x:[i.replace(" ","") for i in x])
    movies['country']=movies['country'].apply(lambda x:[i.replace(" ","") for i in x])
    movies['language']=movies['language'].apply(lambda x:[i.replace(" ","") for i in x])

    movies['tags']=movies['overview']+movies['genre']+movies['Director']+movies['Cast']+movies['language']+movies['country']

    movies['tags']=movies['tags'].apply(lambda x:" ".join(x))

    movies['tags']=movies['tags'].apply(stem)

    movies['tags']=movies['tags'].apply(lambda x:x.lower())

    # creating tag for genre
    movies['tag_genre']=movies['genre'].apply(lambda x:" ".join(x))
    movies['tag_genre']=movies['tag_genre'].apply(lambda x:x.lower())

    # creating tag for cast
    movies['tag_cast']=movies['Cast'].apply(lambda x:" ".join(x))
    movies['tag_cast']=movies['tag_cast'].apply(lambda x:x.lower())

    movies.reset_index(inplace=True)
    movies.drop(["index"], axis=1, inplace=True)

    # print(movies.head())
    return movies

def vectorization(movies):
    # Vectorization 
    vectors=vectorizer.fit_transform(movies['tags']).toarray()
    similarity=cosine_similarity(vectors)
    #building similarity for genre
    vectors_genre=vectorizer.fit_transform(movies['tag_genre']).toarray()
    similarity_genre=cosine_similarity(vectors_genre)
    #building similarity for genre
    vectors_cast=vectorizer.fit_transform(movies['tag_cast']).toarray()
    similarity_cast=cosine_similarity(vectors_cast)
    return similarity,similarity_genre,similarity_cast

def similar_movies(movie_id,number_of_movies,movies,similarity):
    movie_id=int(movie_id)
    print(movies['movie_id'], type(movies['movie_id']))
    movie_index = movies[movies['movie_id']==movie_id].index[0]
    # print("Movie index is ",movie_index)
    distances= similarity[movie_index]
    # print(distances)
    movies_list=sorted(list(enumerate(distances)),reverse=True,key=lambda x:x[1])[0:number_of_movies]
    # print(movies_list)
    movie_id=[movies.iloc[i[0]].movie_id for i in movies_list]
    # print(movie_id)
    return movie_id

def recommend_movies(movie_id,number_of_movies,movies,similarity,similarity_genre,similarity_cast):
    movie_id = int(movie_id)
    movie_index = movies[movies['movie_id']==movie_id].index[0]

    # based on all factors
    movie_id_all=similar_movies(movie_id,number_of_movies,movies,similarity)

    # print(movies.head())
    def custom_key(item):
        index, similarity_score = item
        rating=movies.iloc[index].rating
        rating=float(rating)
        return (-similarity_score, -rating)

    # based on genre
    distances_genre_based=similarity_genre[movie_index]
    movies_list_genre_rating_based=sorted(list(enumerate(distances_genre_based)),key=custom_key)[0:number_of_movies]

    movie_id_genre_based=[movies.iloc[i[0]].movie_id for i in movies_list_genre_rating_based]
    
    # based on cast
    distances_cast_based=similarity_cast[movie_index]
    movies_list_cast_rating_based=sorted(list(enumerate(distances_cast_based)),key=custom_key)[0:number_of_movies]

    movie_id_cast_based=[movies.iloc[i[0]].movie_id for i in movies_list_cast_rating_based]

    recommend={
        "all_feature":movie_id_all,
        "genre_based":movie_id_genre_based,
        "cast_based":movie_id_cast_based
    }

    return recommend


def max_rated_movie(movie_id_list,movies):
    m=0
    movie=-1
    for movie_id in movie_id_list:
        if (list(movies[movies["movie_id"]==movie_id]["rating"])[0]>m):
            m=list(movies[movies["movie_id"]==movie_id].rating)[0]
            movie=movie_id

    return list(movies[movies["movie_id"]==movie_id].movie_title)[0]


def movie_recommendation_user_based_preprocess(user_watched_moives,movies):
    tags=[]
    for user_movies in user_watched_moives:
        tag=""
        i=0
        for movie_id in user_movies:
            x=list(movies[movies["movie_id"]==movie_id].tags)
            tag=tag+" "+x[0]
            i=i+1
            if(i==5):
                break
        tags.append(tag)
    
    # Vectorization of tag
    vectors_users=vectorizer.fit_transform(tags).toarray()
    similarity_users=cosine_similarity(vectors_users)

    return similarity_users

def movie_recommendation_user_based(user_index,number_of_movies,user_watched_moives,similarity_users,movies,similarity):
    distances_users_based=similarity_users[user_index]
    user_list_users_based=sorted(list(enumerate(distances_users_based)),reverse=True,key=lambda x:x[1])[1:2]
    most_similar_user=user_list_users_based[0][0]

    list1=user_watched_moives[user_index]
    list2=user_watched_moives[most_similar_user]

    movie_list_id=[id for id in list2 if id not in list1]
    movie_list=[list(movies[movies["movie_id"]==id]["movie_title"])[0] for id in movie_list_id]
    if len(movie_list_id)<number_of_movies:
        x=number_of_movies-len(movie_list)
        highest_rated_movie=max_rated_movie(movie_list_id,movies)
        y=similar_movies(highest_rated_movie,x,movies,similarity)
        movie_list_id=movie_list_id+y
        return movie_list_id
    else:
        return movie_list_id





# movies=pd.read_csv("modified_dataset.csv")
# movies=preprocess_dataset(movies)
# # movies.to_csv('pre_processed_dataset.csv')
# similarity,similarity_genre,similarity_cast=vectorization(movies)
# movies_list=movies["movie_title"]
# movies_id_list=["movie_id"]
# print("movie name")
# movie_name=input()
# while movie_name!="exit":
#     movie_name=process.extractOne(movie_name,movies_list)[0]
#     print(type(movie_name))
#     print(movie_name)
#     movie_id=movies[movies['movie_title']==movie_name]
#     movie_id=movie_id.iloc[0]['movie_id']
#     number_of_movies=5
#     recommendations=recommend_movies(movie_id,number_of_movies,movies,similarity,similarity_genre,similarity_cast)
#     print("All features based : ")
#     print(recommendations["all_feature"])
#     print("Genre based : ")
#     print(recommendations["genre_based"])
#     print("Cast based : ")
#     print(recommendations["cast_based"])
#     print(recommendations)
#     movie_name=input()


# user_watched_moives=[[5,11,12,13,14,71,74,75,78,81],
#        [14,11,13,12,18,82,85,87,88,89],
#        [5,25,28,33,35,90,93,96,97,98]]

# user_index=1
# number_of_movies=5
# print("Similar user based movie recommended: ")
# similarity_users=movie_recommendation_user_based_preprocess(user_watched_moives,movies)
# movies_based_on_most_similar_user=movie_recommendation_user_based(user_index,number_of_movies,user_watched_moives,similarity_users,movies,similarity)
# print(movies_based_on_most_similar_user)