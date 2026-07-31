import axios from "axios";


export async function searchHotelsService({preferences})
{
    const isBudget=(preferences.travelType==="budget");
    const params={
        engine:"google_hotels",
        q:preferences.district,
        check_in_date:preferences.dateRange.startDate,
        check_out_date:preferences.dateRange.endDate,
        adults:preferences.groupSize,
        currency:"INR",
        gl:"in",
        hl:"en",
        vacation_rentals: false,
        sort_by:(isBudget)?3:8,
        rating:(isBudget)?7:8,
        api_key:process.env.SERP_API_KEY

    }
    console.log(params);
    const response = await axios.get("https://serpapi.com/search",{params});
    const results = response.data.properties || [];
    return results;

}



export function extractHotelsService(results)
{
    let hotels=[];
    hotels=results.map(element => ({
      
      name: element.name,

      check_in_time: element.check_in_time,
      check_out_time: element.check_out_time,

      per_night:
        element.rate_per_night?.extracted_before_taxes_fees ||
        element.rate_per_night?.extracted_lowest ||
        null,

      total_price:
        element.total_rate?.extracted_before_taxes_fees ||
        element.total_rate?.extracted_lowest ||
        null,

      free_cancellation:
        element.prices?.[0]?.free_cancellation || false,

      free_cancellation_until_date:
        element.prices?.[0]?.free_cancellation_until_date || null,

      free_cancellation_until_time:
        element.prices?.[0]?.free_cancellation_until_time || null,

        num_of_people:element.prices?.[0]?.num_guests || null,

      thumbnail:
        element.images?.[0]?.original_image || null,

      rating:
        element.overall_rating || null,

      amenities:
        element.amenities || [],

      latitude:
        element.gps_coordinates?.latitude || null,

      longitude:
        element.gps_coordinates?.longitude || null,

      type:
        element.type || "hotel",

      property_id:
        element.propert_token,
      
      booking_links:[], 

      }));
    return hotels;
}


