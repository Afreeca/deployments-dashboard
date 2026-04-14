from pymongo.collection import Collection

from core.config import settings
from database.client import db


deployments_collection: Collection = db[settings.deployments_collection]
