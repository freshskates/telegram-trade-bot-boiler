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
    # OR
    npx prisma migrate dev --create-only  # Create migration file but not run it
    # Read migration file and make changes
    npx prisma migrate dev

    # Generate the new prisma index.d.ts file npx prisma generate  
    npx prisma generate  

    # If you want the modity the actual db with your migrations
    npx prisma migrate deploy

    npx prisma studio  # Use this to see the database
    npm run dev


#### See the DB
    npx prisma studio