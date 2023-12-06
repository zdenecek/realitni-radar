

def get_reverse_geocode_url(lon, lat):
    return f"https://geocode.maps.co/reverse?lat={lat}&lon={lon}&accept-language=cs"

def normalize_address(address):

    if "postcode" in address:
        address['postcode'] = address['postcode'].replace(" ", "")

    main_city = ""
    for key in ['village', 'town', 'city']:
        if key in address:
            main_city = address[key]
            break
    
    if len(main_city) > 0:
        address['mainCity'] = main_city

    return address
