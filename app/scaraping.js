module.exports = function() {

  return {

    movieInfos : function(myurl, pResult, callback) { // function for IMdb 크롤링 뒤 Json array로 반환

      var cheerio = require('cheerio');
      var request = require('request');
      var dateUtils = require('./dateUtils.js');

      var movieReviews = [];
      request(url , function(error, response, html){
        if (error) {throw error};

        // console.log (html);

        var $ = cheerio.load(html);

        $movie_come_day = null;
        $('div.list.detail').children().each(function(i, elem) {
          myJson = {};
          if($(this).hasClass('list_item') == false) { //it means Date Section
            // evaluate movie date
            var date = new Date();
            var tokens = $(this).find('a').text().split(' ');
            var convertedMonth = dateUtils().month[tokens[0]];
            date.setMonth(convertedMonth);
            date.setDate(Number(tokens[1]));
            $movie_come_day = date.getTime();
          } else {
            $(this).find('.overview-top').each(function() {
              $(this).find('.outline').each(function() {
                myJson.m_outline = $(this).text();
              });
              $(this).find('h4').find('a').each(function() {
                myJson.m_title = $(this).text();
                myJson.m_link = $(this).attr('href');
              });
              $(this).find('span[itemprop="director"]').find('span[itemprop="name"]').find('a').each(function() {
                myJson.m_director = $(this).text();
              });

              var genre_box = [];
              $(this).find('.cert-runtime-genre').each(function() {
                $(this).find('span[itemprop="genre"]').each(function() {
                  genre_box.push($(this).text());
                });
              });
              myJson.m_genres = genre_box;
            });

            myJson.m_date = $movie_come_day ;

            $(this).find('.poster').each(function() {
              myJson.image = $(this).attr('src');
            });
            movieReviews.push(myJson);
          }
        });

        console.log('processed crawling : ' + myurl);
        //console.log(movieReviews);
        callback(pResult.concat(movieReviews)); //old result, new result
      })
    }
  }
}
