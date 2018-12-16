const { pgdb}  = require('../db/pgdb.js')

// const knex = require('knex')
// const url = 'postgres://izphwmbnwhbhbr:b77f2483ad1fe298be80d5a2cf6813781a16404ea0207553977cae61df721c48@ec2-54-243-59-122.compute-1.amazonaws.com:5432/d3p4pg7cohkuo4'
// const pgdb = knex({
//     client: 'pg',
//     connection: url + '?ssl=true'
// })



const getLatestBeautyArticles = (req, res) => {

    const { cursor, limit } = req.query
    fetchLatestBeaytyAricles(cursor,limit)
        .then(result => {
            res.json(result)
        }).catch(e => {
            res.statusCode = 500
            res.json({ success:false,errMsg:e.message})
        })
        
}

const getLatestBeautyArticles2 = (req, res) => {

    const { cursor, limit ,title, rate} = req.query
    const startTime = Date.now()

    fetchLatestBeaytyAricles2(cursor, limit, title, rate)
        .then(result => {
            console.log('查詢article花費時間: ' + (Date.now() - startTime))
            res.json(result)
        }).catch(e => {
            res.statusCode = 500
            res.json({ success: false, errMsg: e.message })
        })

}


const fetchLatestBeaytyAricles = async (cursor = new Date().toLocaleString(), limit = 20) => {

    const create_date = pgdb.raw('to_char(create_date) as create_date')
    try {
        const results = await pgdb.select('article_id', 'title', 'author', 'rate', 'article_url','pre_image', pgdb.raw('to_char(article_date,\'YYYY-MM-DD HH24:MI\') as article_date'))
            .from('ptt_beauty_article')
            .where('article_date', '<', `${cursor}`)
            .orderBy('article_date', 'desc').limit(limit)
        
        if (!results) {
            return { cursor, success: true, code: 204, data: results}
        }
        
        const lastCursor = results[results.length - 1].article_date
        return { cursor: lastCursor, success: true, code: 200, data: results}


    } catch (e) {
        return e
    }
    
}


const fetchLatestBeaytyAricles2 = async (cursor = new Date().toLocaleString(), limit = 20, title='', rate=20) => {

    const create_date = pgdb.raw('to_char(create_date) as create_date')
    try {
        const results = await pgdb.select('article_id', 'title', 'author', 'rate', 'article_url', 'pre_image', pgdb.raw('to_char(article_date,\'YYYY-MM-DD HH24:MI\') as article_date'))
            .from('ptt_beauty_article')
            .where('article_date', '<', `${cursor}`)
            .andWhere('title', 'like', `%${title}%`)
            .andWhere('rate', '>=', `${rate}`)
            .orderBy('article_date', 'desc').limit(limit)

        
        if (!results) {
            return { cursor, success: true, code: 204, data: results }
        }
        if (results.length == 0) {
            return { cursor, success: true, code: 204, data: results }
        }

        const lastCursor = results[results.length - 1].article_date
        return { cursor: lastCursor, success: true, code: 200, data: results }


    } catch (e) {
        return e
    }

}



const getBeautyArticleImagesById = (req, res) => {
    const {id} = req.params
    pgdb('ptt_beauty_image')
        .where('article_id','=',`${id}`)
        .select('image_url','image_id')
        .then(results => {
            // const formattedResult = results.map(imgObject => {
            //     const 
            //     return imgObject.image_url
            // })
            
            // if (results.length < 1) {
            //     res.json({ code: 200, data: results });
            // }
            res.json({ code: 200, data: results});
        }).catch (e => {
        res.json({code:500,data:'server error'});
    })
}

const getBeautyArticleById = (req, res) => {
    const { id } = req.params
    pgdb('ptt_beauty_article')
        .where('article_id', '=', `${id}`)
        .select('article_id', 'title', 'author', 'rate', 'article_url', 'pre_image', pgdb.raw('to_char(article_date,\'YYYY-MM-DD HH24:MI\') as article_date'))
        .then(result => {

            if (result.length > 0) {
                res.json({ code: 200, data: result[0] });
            } else {
                res.json({ code: 500, data: 'have no image' });
            }

        }).catch(e => {
            res.json({ code: 500, data: 'server error' });
        })
}

const getRandomImage = (req, res) => {
    pgdb('ptt_beauty_image')
        .join('ptt_beauty_article', 'ptt_beauty_image.article_id', 'ptt_beauty_article.article_id')
        .select('ptt_beauty_image.image_url', 'ptt_beauty_article.rate', 'ptt_beauty_article.article_url', 'ptt_beauty_article.title','ptt_beauty_article.article_id')
        .orderBy(pgdb.raw('RANDOM()')).limit(1)
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({code:200,data:result[0]});
            }else {
                res.json({code:500,data:'have no image'});
            }
            
        }).catch (e => {
            res.json({code:500,data:'server error'});
    })
}


// const getBeautyArticless = (date, limit=20) => {

//     const create_date = pgdb.raw('to_char(create_date) as create_date')

//     pgdb('ptt_beauty_article')
//         .orderBy('article_date', 'desc').limit(10)
//         .select('article_id', create_date)
//         .then(result => {
//             console.log(result)
//         }).catch(e => {
//             console.log(e.message)
//         })
// }



// getBeautyArticless('2018-03-12 11:28:01',2)


module.exports = {
    getLatestBeautyArticles,
    getLatestBeautyArticles2,
    getBeautyArticleById,
    getRandomImage,
    getBeautyArticleImagesById
}


// SELECT article_id, rate, title, to_char(article_date, 'YYYY-MM-DD HH24:MI:SS') AS article_date FROM ptt_beauty_article
// WHERE article_date > date("2016-02-2")
// ORDER BY article_date DESC
// LIMIT 100