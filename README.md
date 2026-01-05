# movieclub app latest v3.0
for local development
`% pnpm dev`
for db exploration
`% pnpm run db:studio`

## TODO
- [x] Make it deploy (Vercel)
- [ ] Scaffold basic UI with mock data
    - [x] topnav
    - [x] club list page
    - [x] add movies page (init club list)
    - [ ] init club list page (hidden url for now just me)
        - can be future deal, for now just hardcode the /list/1/add to add to list 1
    - [x] no homepage (add later, for now homepage is future .com/list/{listId} page)
- [x] Set up db
- [x] atttach db to UI
- [x] set up tmdb API (adds movie info to our db when added to list (add mov page))
- [x] make so can (1) search for a movie, add to list (confirm button?), server adds relevant info to db
- [x] hand over to LLM with specs for my 3 pages
- [x] routing? (club page)
    - movieclub.com/list/{listid}/add/      - to send to the gc (no safety checks yet i trust us (default 2 movies for now?))
    - movieclub.com/list/{listId}
    - movieclub.com/create
- [x] make list display from db
    - [x] (group by usernm!)
- [ ] curr movies div fixed width rn its flex and its changing depending on movie.overview size
- [x] maybe add list constrainsts to data table? 
    - `movie choice update freq(ex=1week); movieclubstartdate (ex=jan5)`
    - stuff to help for when add new lists
- [ ] update add-movies to add list title and desc too,
    - by first fetching the list title and desc first
    - until createlist page, have to add 1st list nm desc manual to db first
- [x] make it pick movies correctly every week
    - fill out database with mock movies (but pretty much same movies and user)
    - test desired functionality
        - new movie(s) each week,
        - randomly from everyone but
            - goes thru everyones 1 (still random) before the next one
        - after picked updates `watched`
- [ ] clear "movie added successfully" text on new search
- [ ] error mgmt (Sentry?) dont really need fr rn