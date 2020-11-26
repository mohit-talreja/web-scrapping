const fs = require('fs')

const request = require('request-promise')

const cheerio = require('cheerio')

const json2csv = require('json2csv').Parser

const csvParser = require('csv-parser')

const movies = [
    'https://www.imdb.com/title/tt10048342/?ref_=hm_fanfav_tt_1_pd_fp1',
    'https://www.imdb.com/title/tt12392504/?ref_=hm_fanfav_tt_2_pd_fp1',
    'https://www.imdb.com/title/tt12411074/?ref_=hm_fanfav_tt_3_pd_fp1',
    'https://www.imdb.com/title/tt8111088/?ref_=hm_fanfav_tt_5_pd_fp1',
    'https://www.imdb.com/title/tt10731264/?ref_=hm_inth_1',
    'https://www.imdb.com/title/tt6473300/?ref_=hm_tpks_tt_6_pd_tp1',
    'https://www.imdb.com/title/tt3605418/?ref_=hm_stp_pvs_piv_tt_2'
]

async function webScrapper(){
    const imdbData = []
    
    for(let movie of movies){
        const response = await request({
            uri : movie,
            headers : {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en,en-US;q=0.9"
    
            }
        })
    
        const $ = cheerio.load(response)
    
        const title = $('div[class="title_wrapper"] > h1').text().trim()
        
        const summary = $('div[class="summary_text"]').text().trim()
        
        const rating = $('div[class="ratingValue"] > strong').text()
        
        const releaseDate = $('a[title="See more release dates"]').text().trim()
    
        imdbData.push({
            title,
            summary,
            rating,
            releaseDate
        })
    }

    const j2csv = new json2csv()

    const csv = j2csv.parse(imdbData)

    fs.writeFileSync('./imdb.csv', csv, 'utf-8')
}

webScrapper()


const csvData = []

fs
    .createReadStream('./imdb.csv')
    .pipe(csvParser({}))
    .on('data', (movie) => {
        csvData.push(movie)
    })
    .on('end', () => {
        console.log(csvData)
    })

