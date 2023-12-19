from datetime import datetime
import scrapy
import os
from pymongo import MongoClient
import pymongo.errors
import sreality_scraper.src.osm as osm
from sreality_scraper.src.osm import get_reverse_geocode_nominatim_url, get_reverse_geocode_url
from sreality_scraper.src.sreality import deal_codes, property_codes


base_query =  {
            "location": {"$geoWithin": {"$box": [ (11, 48), (20, 52)]}},
            "addressData": {"$exists": False}
            
        }

query = [
    {
        "$match":  base_query
    },
    {
        "$addFields": {
            "order": {
                "$switch": {
                    "branches": [
                        {"case": {"$and": [{"deal": deal_codes["sell"]}, {"property": property_codes["apartment"]}]}, "then": 1},
                        {"case": {"$and": [{"deal": deal_codes["rent"]}, {"property": property_codes["apartment"]}]}, "then": 2},
                        {"case": {"$and": [{"deal": deal_codes["sell"]}, {"property": property_codes["commercial"]}]}, "then": 3},
                        {"case": {"$and": [{"deal": deal_codes["sell"]}, {"property": property_codes["house"]}]}, "then": 4}
                    ],
                    "default": 5
                }
            }
        }
    },
    {
        "$sort": { "deleted": 1, "order": 1}
    }
]

class AddressSpider(scrapy.Spider):
    name = 'address'
    query = query
    url_function = get_reverse_geocode_url
    
    collection_name = 'houses'

    custom_settings = {
        'LOG_LEVEL': 'INFO',
        'LOG_FILE': os.path.join(os.getenv("LOG_DIR"), "address-spider.log"),
        'AUTOTHROTTLE_ENABLED':  True,
        'DOWNLOAD_DELAY': 1.6,
        'RANDOMIZE_DOWNLOAD_DELAY': False
    }

    def start_requests(self, func = get_reverse_geocode_url):
        self.counter = 0
        self.client = MongoClient(
            self.settings.get("MONGODB_CONNECTION_STRING"))
        self.db = self.client[self.settings.get("MONGODB_DB")]
        self.coll = self.db[self.settings.get("MONGODB_COLLECTION")]
        
        self.logger.info(f"Starting address scraping with {self.coll.count_documents(base_query)} items")

        yield from self.find_listings(self.query, func)

    def find_listings(self, query, function):
        try:
            for listing in self.coll.aggregate(query):
                lat, lon = listing['location']['coordinates']
                url = function(lat, lon)
                self.logger.debug(url)
                yield scrapy.Request(
                    url=url,
                    callback=self.handle,
                    meta={'id': listing['_id']})
        except pymongo.errors.CursorNotFound:
            self.logger.info("Cursor not found, restarting")
            yield from self.find_listings(query, function)

    def handle(self, response):

        address = osm.normalize_address(response.json()['address'])
        if address:
            self.coll.update_one({ '_id': response.meta['id'] }, { '$set': { 'addressData': address } })
            self.counter += 1
            
            if self.counter % 100 == 0:
                self.logger.info(f'Updated {self.counter} items')

    def spider_closed(self, spider):
        self.client.close()


class NominatimSpider(AddressSpider):
    
    name = 'nominatim'
    query = query[:-1] + [   {
        "$sort": {  "order": -1}
    }]
    
    custom_settings = {
        'LOG_LEVEL': 'INFO',
        'LOG_FILE': os.path.join(os.getenv("LOG_DIR"), "address-spider.log"),
        'AUTOTHROTTLE_ENABLED':  True,
        'DOWNLOAD_DELAY': 1.6,
        'RANDOMIZE_DOWNLOAD_DELAY': False,
        'USER_AGENT': "iml-bridge-database/1.0",
        'DEFAULT_REQUEST_HEADERS': {
            'Referer': 'https://www.iml-bridge-db.de' 
        }
    }
    
    def start_requests(self):
        return super().start_requests(get_reverse_geocode_nominatim_url)

