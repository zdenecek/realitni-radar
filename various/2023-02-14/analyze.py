#!/usr/bin/env python3

import csv
import json
import datetime
# Input file name
file_name = 'results.csv'
out_file_name = "test"
date_format = "%Y-%m-%d"

# Initialize an empty list to store the data from the third column
third_column = []


def all(func):
    # Open the CSV file and read the data
    with open(file_name, 'r') as file:
        reader = csv.reader(file)
        headers = next(reader)  # skip the first row (headers)

        for row in reader:
            row[2] = json.loads(row[2])
            func(row)


counter = {}
one_days = {}
all_counter = 0
counter_bounce = {}

def process_row(row):
    global counter, all_counter, one_days, counter_bounce
    
    values = list(row[2].values())
    keys = list(row[2].keys())
    
    if len(values) < 2 or not values[0] or not values[1]:
        return
    
    if type(values[0]) is  not int  or type(values[1]) is  not int:
       # print(f"Invalid values: {values[0]} -> {values[1]}")
        return
    
    if values[0] < values[1]:
        days = datetime.datetime.strptime(keys[1], date_format) - datetime.datetime.strptime(keys[0], date_format)
                
        if(days.days == 1 and len(values) > 2 and values[0] == values[2]):
            # print(row[1])        
            if(keys[0] not in counter_bounce):
                counter_bounce[keys[0]] = 1
            else:
                counter_bounce[keys[0]] += 1

        
        c = counter if days.days > 1 else one_days
        all_counter += 1
        
        if(keys[0] not in c):
            c[keys[0]] = 1
        else:
            c[keys[0]] += 1  




all(process_row)

    
print("two or more day increases:")

for key in counter:
    print(f"{key}: {counter[key]}")
    
print("one day increases:")

for key in one_days:
    print(f"{key}: {one_days[key]}")
    
print("one day increases that return to first price:")

for key in counter_bounce:
    print(f"{key}: {counter_bounce[key]}")
    
print(f"Total: {all_counter}")
