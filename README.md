# movieclub app latest v3.0
for local development
`% pnpm dev`
for db exploration
`% pnpm run db:studio`
to update db
`% pnpm run db:push`

## TODO
- [x] Make it deploy (Vercel)
- [x] Scaffold basic UI with mock data
    - [x] topnav
    - [x] club list page
    - [x] add movies page (init club list)
    - [x] init club list page (hidden url for now just me)
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
- [x] curr movies div fixed width rn its flex and its changing depending on movie.overview size
- [x] maybe add list constrainsts to data table?
    - `movie choice update freq(ex=1week); movieclubstartdate (ex=jan5)`
    - stuff to help for when add new lists
- [x] update add-movies to add list title and desc too,
    - by first fetching the list title and desc first
    - until createlist page, have to add 1st list nm desc manual to db first
- [x] make it pick movies correctly every week
    - fill out database with mock movies (but pretty much same movies and user)
    - test desired functionality
        - new movie(s) each week,
        - randomly from everyone but
            - goes thru everyones 1 (still random) before the next one
        - after picked updates `watched`
- [x] make top left banner href back to homepage
- [x] add actual home page to see different lists
    - have visible small icons of that lists currMovies? or too much of a big db call
        - `select movieposter, currweek from movies where currweek=max(currweek) group by listId`
    - [x] move list view to `/list/[listId]/page.tsx`
- [x] (create new list button top right)
- [x] add list create page `/list/create`
    - [x] add numCurrMovies to db
    - list name, desc, start date to create - make a placeholder then remove after movie put in? seems odd, should change db
    - think i gotta change db
        - keep this same one same, but only list id
        new table is list with listID, list name, desc, startdate, creatorNm, nummovies/time, frequency (like 3 every 2 weeks, 1 every 3 days)... idk
    - if no change db then process would be
        - find `newID := max(listID)` from db make new one +1, have form for input
            - list Title
            - list Description
            - **list start date/time** nah we doin button (check if startdate==null->show button else do curr stuff (or just have a startButton.tsx element thats called `<StartButton /><currMovies /><listMovies />`) that doesn't do anything if alr started)
            - user name
            - first movie
        - make button thats like "start now" and shit? instead of setting start date at list init and waiting like overnight, can get movies now at press of button (instead of curr display "get new movies/start club" button)
    - if have list table, also have list-passphrase as col, have creator set passphrase, and have users submit it to add to list (different one for remove/change?)
- [ ] start list button
- [ ] add skeleton components for before page loads ("empty/loading" icons)
- [ ] safety check for undef behavior in curr section before start/after end
    - changing to check if no start-date: then do start list button
- [ ] click on movie poster in list for overview ->? letterboxd
- [ ] instead of everytime checking for is-weekCurr current?
    - have a button show up after a week (Select new movies)
    - have the button trigger the new movies being picked function..?
    - and then show this weeks movies and hide
- [ ] remove/edit movies


new functionality
- [ ] instead of "start-date/time" in list create, have list be added to and then creator gets to press button that says "START THE CLUB"
- [ ] LOCK add-movie page after startDate?? to ensure everyone's in ... tempting -- no just doing startlist button to specify
- [ ] thumbs up button for users to "rate" the movie on the site!
    - see how many thumbsed it up, thumbed it down!
    - or just a button to say "i watched"
    - needs whole new db structure for this (or cookies? device fingerprinting?)
- [ ] hard limit num movies added by user (ratelimit ip? browser/device fingerprinting?)
- [ ] on create list page
    - create list or add functionality of just "pick a movie for tonight"
        - which just chooses one movie

cosmetic
- [x] clear "movie added successfully" text on new search or make it a toast (shadcn deprecated toast)
- [x] after movie chosen along w opacity 50% text overlay with m.currWeek to see when watched
- [ ] display list title in add movie page
- [ ] make homepage prettier
    - [ ] display curr-movies...?
- [ ] click on movie poster for overview -> letterboxd
- [ ] make the order random? like of the people
- [ ] display when new movies will load in curr div (countdown timer? `pnpm install react-countdown --save`) research [react-countdown](https://github.com/ndresx/react-countdown)
- [ ] make desktop list not just 2 movies wide
- [ ] optimize for mobile
- [ ] [shadcn components](https://ui.shadcn.com/docs/components) OR [8BITCN COMPONENTS](https://www.8bitcn.com/docs)
    - [ ] datepicker for list init startdate
    - [ ] or just `field` for list init
    - [ ] input box for inputs (usernm, search box)
    - [ ] empty for empty list (but should prompt creator to be first to add to list right after create list anyway)
- [ ] skeleton components
- [ ] storybook for testing UI stuff...? "component library"

infra
- [ ] error mgmt (Sentry)
- [ ] posthog
- [ ] shadcn components
- [ ] rework db multiple tables instead of 1 (movieList, movieListItem, movie, users? idk what'd i make it before)
