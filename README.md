<!-- # Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information. -->


# movieclub app latest v3.0

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
- [ ] make list display from db
- [ ] update add-movies to add list title and desc too,
    - by first fetching the list title and desc first
    - until createlist page, have to add manual to db first
- [ ] make it pick movies correctly every week
    - fill out database with mock movies (but pretty much same movies and user)
    - test desired functionality
        - new movie(s) each week,
        - randomly from everyone but
            - goes thru everyones 1 (still random) before the next one
        - after picked updates `watched`
- [ ] error mgmt (Sentry?) dont really need fr rn