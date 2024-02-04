const formatTextForFirestore = (item) => {
  return {
    id: item.id,
    title: item.title,
    year: item.year,
    poster: item.poster_path,
    type: item.type,
  };
};

const formatText = (items) => {
  if (items.length === 0) return "No Media found";
  let res = "";
  items.forEach((element, index) => {
    res += `${index + 1}. ${element.title} (${element.year}) \n`;
  });
  return res;
};

const createMessageText = (movie) => {
  return `<strong>Title: ${movie.title}</strong>\n<em>${movie.year}</em>\n${movie.description}
  <a href="https://image.tmdb.org/t/p/w200/${movie.poster_path}">&#8205;</a>`;
};

module.exports = { formatText, createMessageText, formatTextForFirestore };
