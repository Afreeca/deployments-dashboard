from pymongo import MongoClient
from pymongo.database import Database

from core.config import settings

client = MongoClient(settings.mongo_uri)
db: Database = client[settings.database_name]
