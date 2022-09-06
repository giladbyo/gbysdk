import got from 'got'

export default class GBYSDK {

    token     // Token needed for the-one-api.dev
    cache     // Caching to store got returned data
    baselink  // Base API link
    basemeta  // Base meta data for got

    chunk     // size limit per call
    max       // max number of data to return
    expand    // replace ids with name - NOT IMPLEMENTED

    _books    // internal variable to hold ALL books
    _movies   // internal variable to hold ALL movies
    _chapters // internal variable to hold ALL chapters
    // _characters

    /**
     * construction
     * @param  {String} token   Token needed for the-one-api.dev
     * @param  {Object} options Configuration options
     */
    constructor(token, options) {
        
        this.token = token

        if (!token) {
            throw new Error('token not supplied, please register: https://the-one-api.dev/account')
        }

        this.cache = new Map()
        this.baselink = 'https://the-one-api.dev/v2'
        this.basemeta = {
            cache: this.cache,
            responseType: 'json',
            headers: {
              Authorization: `Bearer ${this.token}`
            },
        }

        this.chunk = options['chunk']
        this.max = options['max']
        this.expand = options['expand']

    }

    /**
     * request - reusable network function
     * @param  {String} path    Path added to baselink
     * @param  {Object} options Optional query parameters
     */
    async request(path, options) {
        
        var result = []

        try {
            var link = this.baselink + path
            var meta = this.basemeta
    
            let url = new URL(link)
    
            // join arrays with comma
            var params = Object.assign({}, ...Object.keys(options || {}).map(key => {
                var value = options[key]
                if (Array.isArray(value)) {
                    value = value.join(',')
                }
                return ({[key]: value})
            }))
    
            let page = 1
            let limit = this.chunk
    
            url.search = new URLSearchParams({...params, page, limit})
            link = url.href
    
            while (true) {
    
                if (result.length >= this.max) {
                    break
                }
    
                let response = await got(link, meta)
    
                if (response.statusCode != 200) {
                    break
                }
    
                let body = response.body
                result = [...result, ...body.docs]
    
                let limit = body['limit']
                let page = body['page']
                let pages = body['pages']
    
                if (page && pages && page < pages) {
                    page += 1
                    url.search = new URLSearchParams({...params, page, limit})
                    link = url.href
                } else {
                    break
                }
    
            }
    
            /*
            if (this.expand) {
                result = result.map(item => {
                    return Object.assign({}, ...Object.keys(item || {}).map(key => {
                        var value = item[key]
                        switch (key) {
                            case 'books':
                                break
                            case 'movie':
                                break
                            case 'chapter':
                                break
                        }
                        return ({[key]: value})
                    }))
                })
            }
            */
           
        } catch(err) {
            throw new Error('error calling API: ' + err.message)
        }

        return result      
    }

    /**
     * books - get and set ALL books
     */
    get books() {
        return (async () => {
            if (!this._books) {
                this._books = this.request('/book')
            }
            return this._books
        })()
    }

    /**
     * movies - get and set ALL movies
     */
     get movies() {
        return (async () => {
            if (!this._movies) {
                this._movies = this.request('/movie')
            }
            return this._movies
        })()
    }

    /**
     * chapters - get and set ALL chapters
     */
    get chapters() {
        return (async () => {
            if (!this._chapters) {
                this._chapters = this.request('/chapter')
            }
            return this._chapters
        })()
    }

    /**
     * getBooks - return books with filtering options
     * @param  {Object} options Filtering options
     */    
    async getBooks(options) {
        return this.request('/book', options)
    }

    async getBookChapter(id) {
        return this.request(`/book/${id}/chapter`)
    }

    async getMovies(options) {
        return this.request('/movie', options)
    }

    async getMovieQuote(id) {
        return this.request(`/movie/${id}/quote`)
    }

    async getCharacters(options) {
        return this.request('/character', options)
    }

    async getCharacter(id) {
        return this.request(`/character/${id}`)
    }

    async getCharacterQuote(id) {
        return this.request(`/character/${id}/quote`)
    }

    async getQuotes(options) {
        return this.request('/quote', options)
    }

    async getQuote(id) {
        return this.request(`/quote/${id}`)
    }

    async getChapters(options) {
        return this.request('/chapter', options)
    }

    async getChapter(id) {
        return this.request(`/chapter/${id}`)
    }

}
