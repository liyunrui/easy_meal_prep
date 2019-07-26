"""
Sending data into index.API(Elastic Search)

Before running this script, make sure launch your elastic search in terminal.
"""
import os
import pandas as pd
import sys
from elasticsearch import Elasticsearch

pd.options.display.max_rows = 100
pd.options.display.max_columns = 100
pd.options.display.max_colwidth = 500

def connect_elasticsearch():
    """
    Before running this function, make sure you launch elasticsearch in terminal 
    """
    _es = None
    _es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
    if _es.ping():
        print('Succesfully Connected')
    else:
        print('Failed to connection')
    return _es

def create_index(es_object, index_name):
    """
    we define our Doctype as foods
    """
    created = False
    # index settings
    # the reason why we need mappings is avoid corrupting your data
    settings = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings": {
            # custom type called foods
            "foods": {
                "properties": {
                    # Specify that the food_name field contains text values.
                    "food_name": {
                        "type": "text",
                         "fields": {
                            "raw":{ 
                                "type":  "keyword"
                            } # The food_name.raw field can be used for sorting and aggregations
                        }
                    },
                    # Specify that the categories field contains text values.
                    "categories": {
                        "type": "text",
                         "fields": {
                            "raw":{ 
                                "type":  "keyword"
                            } # The categories.raw field can be used for sorting and aggregations
                        }
                    },
                    # Specify that the calories field contains integer values.
                    "calories": {
                        "type": "integer"
                    },
                    "protein": {
                        "type": "integer"
                    },
                    "carbs": {
                        "type": "integer"
                    },
                    "fat": {
                        "type": "integer"
                    }
                
                },
            }
        }
    }
    try:
        if not es_object.indices.exists(index_name):
            # Ignore 400 means to ignore "Index Already Exist" error.
            es_object.indices.create(index=index_name, ignore=400, body=settings)
            print('Created Index')
        created = True
    except Exception as ex:
        print(str(ex))
    finally:
        return created
    
def store_record(elastic_object, index_name, record):
    """
    index data(Sending a json document to an indexing API)
    """
    is_stored = True
    try:
        # Adds or updates a typed JSON document in a specific index, making it searchable.
        outcome = elastic_object.index(index=index_name, doc_type='foods', body=record)
        print(outcome)
    except Exception as ex:
        print('Error in indexing data')
        print(str(ex))
        is_stored = False
    finally:
        return is_stored
if __name__ == "__main__":
    #-------------------------
    # load data
    #-------------------------
    data_dir = "/Users/yunrui.li/meal_prep_own/meal_prep_refractor/easy-meal-prep/data"
    df = pd.read_excel(os.path.join(data_dir,"台灣食品成分資料庫2018版1071207.xlsx"))
    #-------------------------
    # pre-processing
    #-------------------------
    columns = df.iloc[0].tolist()
    df.rename(columns = {o:n for o,n in zip(df.columns,columns)}, inplace = True)
    col = [
    '食品分類',
    '樣品名稱',
    '熱量(kcal)',
    '粗蛋白(g)',
    '總碳水化合物(g)',
    '粗脂肪(g)',
    ]
    df1 = df.iloc[1:,:][col]
    df1.rename(columns = {"粗蛋白(g)":"蛋白(g)",
                "總碳水化合物(g)":"碳水化合物(g)",
            "粗脂肪(g)":"脂肪(g)"}, inplace = True) # 每100 g可食部分之含量。
    df1 = df1[~df1["熱量(kcal)"].isnull()]
    df1 = df1.fillna(0)
    #-------------------------
    # store data into elasticsearch
    #-------------------------
    food_names_saved_already = []
    for ix, row in df1.iterrows():
        food_name = row["樣品名稱"].strip()
        categories = row["食品分類"]
        calories = row["熱量(kcal)"]
        protein = row["蛋白(g)"]
        carbs = row["碳水化合物(g)"]
        fat = row["脂肪(g)"]
        # records
        result = {
        'food_name': food_name,
        'categories': categories,
        'calories':calories,
        'protein':protein,
        'carbs':carbs,
        'fat':fat,
        }
        if food_name in food_names_saved_already:
            pass
        else:
            # connected to elasticsearch
            es = connect_elasticsearch()
            # index data 
            out = store_record(es, index_name = 'macros', record = result)
            print('Data indexed successfully')
            food_names_saved_already.append(food_name)

