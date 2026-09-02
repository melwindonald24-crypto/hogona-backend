import axios from "axios";


export async function searchHotelDetails(preferences, property_token)
{
    //console.log(preferences, property_token);
    const isBudget=(preferences.travelType==="budget");
    const query=(isBudget)?`budget hotels in ${preferences.district}`:`luxury hotels in ${preferences.district}`;

    const params={
        engine:"google_hotels",
        q:query,
        check_in_date:preferences.dateRange.startDate,
        check_out_date:preferences.dateRange.endDate,
        adults:preferences.groupSize,
        currency:"INR",
        gl:"in",
        hl:"en",
        property_token,
        api_key:process.env.SERP_API_KEY

    }
    // console.log(params);
    const response = await axios.get("https://serpapi.com/search",{params});
    //console.log(response.data);
    const results = response.data || [];
    
    return results;

}





export function extractHotelDetails(response) {
   
    const hotelId = response.property_token ?? null;

    const gps = response.gps_coordinates ?? {};

    const bookingLinks = extractHotelBookingLinks(response);
    const rooms = extractRooms(response);

    return {
        hotelId,

        
        name: response.name ?? null,
        description: response.description ?? null,
        address: response.address ?? null,

       
        latitude: toNumber(gps.latitude),
        longitude: toNumber(gps.longitude),

        
        price: extractPrice(response.rate_per_night),
        totalPrice: extractPrice(response.total_rate),

       
        checkInTime: response.check_in_time ?? null,
        checkOutTime: response.check_out_time ?? null,
        phone: response.phone ?? null,

        
        website: response.link ?? null,

        
        bookingLinks,

        
        rooms,

    };
}

// the hotel details object will look like this{
//   "hotelId": "ChgItd-kudzko_1FGgwvZy8xcHYybDJ0ZGsQAQ",
//   "name": "Aishwarya Suites ( Best Premium Hotel in Mysore )",
//   "description": "Situated 2 km from Mysore Junction train station...",
//   "address": "New Bamboo Bazaar Road, 3844/3...",
//   "latitude": 12.330856,
//   "longitude": 76.6452769,
//   "price": {
//     "amount": 1255,
//     "beforeTaxesFees": 1175,
//     "currency": "INR"
//   },
//   "totalPrice": {
//     "amount": 1255,
//     "beforeTaxesFees": 1175,
//     "currency": "INR"
//   },
//   "checkInTime": "12:00 PM",
//   "checkOutTime": "11:00 AM",
//   "phone": "+91 821 426 2294",
//   "website": "http://www.aishwaryagroupofhotels.com/",
//   "bookingLinks": [
//     {
//       "provider": "Hotels.com",
//       "url": "https://..."
//     },
//     {
//       "provider": "Expedia.com",
//       "url": "https://..."
//     },
//     {
//       "provider": "Agoda",
//       "url": "https://..."
//     }
//   ],
//   "rooms": [
//     {
//       "provider": "Hotels.com",
//       "name": "Classic Double Room, 1 Queen Bed",
//       "images": [
//         "https://..."
//       ],
//       "pricePerNight": {
//         "amount": 3260,
//         "beforeTaxesFees": 3080,
//         "currency": "INR"
//       },
//       "totalPrice": {
//         "amount": 3260,
//         "beforeTaxesFees": 3080,
//         "currency": "INR"
//       },
//       "guests": 2,
//       "rates": [
//         {
//           "provider": "Hotels.com",
//           "bookingUrl": "https://...",
//           "guests": 2,
//           "breakfastIncluded": false,
//           "beds": [
//             {
//               "type": "Queen",
//               "count": 1
//             }
//           ],
//           "pricePerNight": {
//             "amount": 3260,
//             "beforeTaxesFees": 3080,
//             "currency": "INR"
//           },
//           "totalPrice": {
//             "amount": 3260,
//             "beforeTaxesFees": 3080,
//             "currency": "INR"
//           },
//           "inclusions": [
//             "1 queen bed"
//           ]
//         }
//       ]
//     }
//   ]
// }


function extractHotelBookingLinks(response) {
    const links = [];
    const seen = new Set();

    for (const provider of response.featured_prices ?? []) {
        if (!provider || typeof provider !== "object") {
            continue;
        }

        const source = provider.source ?? null;
        const url = provider.link ?? null;

        if (!url) {
            continue;
        }

        const key = `${source ?? "unknown"}|${url}`;

        if (seen.has(key)) {
            continue;
        }

        seen.add(key);

        links.push({
            provider: source,
            url
        });
    }

    return links;
}




function extractRooms(response) {
    const rooms = [];

   
    for (const provider of response.featured_prices ?? []) {
        const providerName = provider?.source ?? null;

        for (const room of provider?.rooms ?? []) {
            if (!room || typeof room !== "object") {
                continue;
            }

            const roomRates = [];

            for (const rate of room.rates ?? []) {
                if (!rate || typeof rate !== "object") {
                    continue;
                }

                if (!rate.link && !rate.rate_per_night && !rate.total_rate) {
                    continue;
                }

                roomRates.push({
                    provider: providerName,

                    bookingUrl: rate.link ?? null,

                    guests: toNumber(rate.num_guests),

                    breakfastIncluded:
                        rate.breakfast_included === true
                            ? true
                            : rate.breakfast_included === false
                                ? false
                                : null,

                    beds: extractBeds(rate.beds),

                    pricePerNight: extractPrice(rate.rate_per_night),

                    totalPrice: extractPrice(rate.total_rate),

                    inclusions: Array.isArray(rate.inclusions)
                        ? rate.inclusions.filter(Boolean)
                        : []
                });
            }

            rooms.push({
                provider: providerName,

                name: room.name ?? null,

                images: Array.isArray(room.images)
                    ? room.images.filter(Boolean)
                    : [],

                pricePerNight: extractPrice(room.rate_per_night),

                totalPrice: extractPrice(room.total_rate),

                guests: toNumber(room.num_guests),

                rates: roomRates
            });
        }
    }

    return rooms;
}



function extractBeds(beds) {
    if (!Array.isArray(beds)) {
        return [];
    }

    return beds
        .filter(bed => bed && typeof bed === "object")
        .map(bed => ({
            type: bed.type ?? null,
            count: toNumber(bed.count)
        }));
}



function extractPrice(price) {
    if (!price || typeof price !== "object") {
        return null;
    }

    const amount = toNumber(price.extracted_lowest);
    const beforeTaxesFees = toNumber(
        price.extracted_before_taxes_fees
    );

    if (amount === null && beforeTaxesFees === null) {
        return null;
    }

    return {
        amount,
        beforeTaxesFees,
        currency: "INR"
    };
}



function toNumber(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
}


