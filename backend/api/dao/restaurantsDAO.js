let restaurants;

export default class RestaurantsDAO {
    static async injectDB(conn) {
        if(restaurants){
            return;
        }
        try {
            //database sample data contains neighborhood and restaurants collections. We just want the restaurant collection.
            restaurants = await conn.db(process.env.NS).collection("restaurants")
        }catch(e){
            console.error( `Unable to establish a collection handle in restaurantsDAO: ${e}`);
        }
    }

    static async getRestaurants({
        filters = null, 
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if(filters) {
            if("name" in filters) {
                query = {$text: {$search: filters["name"]}}
            } else if ("cuisine" in filters) {
                query = {"cuisine": {$eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": {$eq}}
            }
        }

        let cursor

        try{
            cursor = await restaurants.find(query);
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { restaurantsList: [], totalNumRestaurants: 0}
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);
        try {
            const restaurantList = await displayCursor.toArray();
            const totalNumRestaurants = await restaurants.countDocuments(query);

            return { restaurantList, totalNumRestaurants}
        }catch(e){
            console.error(`Unable to convert cursor to array or problem counting documents`)
            return { restaurantList: [], totalNumRestaurants: 0}
        }
    }
    
}

