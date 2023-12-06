from datetime import datetime
import scrapy
import os
from pymongo import MongoClient
import pymongo.errors
import sreality_scraper.src.osm as osm

class AddressSpider(scrapy.Spider):
    name = 'address'
    collection_name = 'houses'

    custom_settings = {
        'LOG_LEVEL': 'INFO',
        'LOG_FILE': os.path.join(os.getenv("LOG_DIR"), f"address-{datetime.now().strftime('%Y-%m-%d-%H-%M-%S')}.log"),
        'AUTOTHROTTLE_ENABLED':  True,
        'DOWNLOAD_DELAY': 1.6,
        'RANDOMIZE_DOWNLOAD_DELAY': False
    }

    def start_requests(self):
        self.counter = 0
        self.client = MongoClient(
            self.settings.get("MONGODB_CONNECTION_STRING"))
        self.db = self.client[self.settings.get("MONGODB_DB")]
        self.coll = self.db[self.settings.get("MONGODB_COLLECTION")]

        query = {"deleted": {"$exists": False}, "location": {
            "$exists": True}, "addressData": {"$exists": False}}

        yield from self.find_listings(query)

    def find_listings(self, query):

        try:
            for listing in self.coll.find(query):
                yield scrapy.Request(
                    url=osm.get_reverse_geocode_url(*listing['location']['coordinates']),
                    callback=self.handle,
                    meta={'id': listing['_id']})
        except pymongo.errors.CursorNotFound:
            self.logger.info("Cursor not found, restarting")
            yield from self.find_listings(query)

    def handle(self, response):

        address = osm.normalize_address(response.json()['address'])
        if address:
            self.coll.update_one({ '_id': response.meta['id'] }, { '$set': { 'addressData': address } })
            self.counter += 1
            
            if self.counter % 100 == 0:
                self.logger.info(f'Updated {self.counter} items')

    def spider_closed(self, spider):
        self.client.close()
