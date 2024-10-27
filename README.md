## TODO

sell page

- sell page display owned tokens
- sell page display sell page menu

buy page

- buy button functionality

positions

- positions page display owned tokens
- positions page display positions

settings

- settings buttons functionality

refresh

- refresh menu

back

- go back to home page


# Running this shit

#### First run
    npx prisma init
    npx prisma db pull  # Will modify schema
    npx prisma db introspect  # Will modify schema

#### Before Running

    Get the .env

#### Dev Run

    npm install
    npx prisma generate
    npx prisma migrate dev  # Use if you updated the schema
    npx prisma studio  # Use this to see the database
    npm run dev


