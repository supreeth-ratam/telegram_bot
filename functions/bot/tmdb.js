const axios = require("axios");
require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
console.log(TMDB_API_KEY);
const searchMedia = async (input, type) => {
  const BASE_URI = `https://api.themoviedb.org/3/search/${type}`;
  try {
    const output = await axios.get(BASE_URI, {
      params: {
        api_key: TMDB_API_KEY,
        query: input,
      },
    });
    // console.log(output.data.results);
    if (type === "movie") {
      const movieList = output.data.results.map((element) => {
        return {
          id: element.id,
          title: element.title,
          poster_path: element.poster_path,
          year: element.release_date ? element.release_date.slice(0, 4) : 0,
          description: element.overview,
          type: "movie",
        };
      });

      return movieList;
    } else {
      const tvList = output.data.results.map((element) => {
        return {
          id: element.id,
          title: element.name,
          year: element.first_air_date.slice(0, 4),
          poster_path: element.poster_path,
          type: "tv",
        };
      });
      return tvList;
    }
  } catch (error) {
    console.log("An error has occured while fetching from api", error);
  }
};

// searchMedia("Hi nanna", "movie").then((res) => console.log(res));

module.exports = { searchMedia };
