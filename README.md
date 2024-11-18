# Telegram Cryptocurrency Token Swapping Bot

## 🚀 About
This bot is designed for cryptocurrency token swapping and features a codebase that is generalized, semi-automatic, and semi-dynamic.

- **Generalized**: The code is structured to support virtually any cryptocurrency coin and its associated tokens, providing flexibility for diverse applications.
- **Semi-Automatic**: The bot's functionality is modular, allowing you to define various bot functions independently. This means that you do not need to consolidate all functionalities into a single file, enhancing organization and maintainability.
- **Semi-Dynamic**: If you add additional properties to ctx.session in a manner consistent with existing properties, the code will seamlessly support these new properties along with their corresponding functionalities. However, if you introduce entirely new properties that differ from the existing ones, additional coding will be necessary to ensure those properties function correctly.


## 📝 TODO

#### Sell Page
- Display owned tokens
- Include a sell page menu

#### Buy Page
- Implement buy button functionality

#### Positions
- Display owned tokens on the positions page
- Show current positions

#### Settings
- Advanced should be able to reset `ctx.session`

---

#### Additional Enhancements (Joseph)
- **Token Header Display**
  - Improve visual presentation of the token header
  - Provide better links to token information on the internet
  - Include analysis for token price trends (upward or downward)

- **Buy/Sell Buttons with Token Header**
  - Enhance indicators for selected buttons, highlighting which actions have been pressed

- **Custom Value Indicators**
  - Use distinct colors or indicators for buttons that accept custom values and reflect those values dynamically

## Running

#### Before Running
Get the .env

#### Development Run
1. Make Prisma stuff 
2. Synchronize your Prisma schema 
3. Accurately reflects changes made directly in the database
4. Run server
```
npm install
npx prisma init
npx prisma db pull  
npx prisma db introspect 
npm run dev
```
#### You updated the Prisma Schema (Make sure nothing is accessing the DB)
`npx prisma generate` will generate the Prisma Client code based on the data model defined in your schema.prisma file.

```
npm install
npx prisma generate
npx prisma migrate dev

npx prisma generate 
``` 
#### You updated the Prisma Schema but need to make specific changes such as "Alter Table" because Prisma lacks advanced support (Make sure nothing is accessing the DB)
Modify the migration file after calling `npx prisma migrate dev --create-only`
```
npm install
npx prisma generate
npx prisma migrate dev --create-only

npx prisma generate  
```
#### You want to apply all pending migrations to your production database (Prisma)
```
npx prisma migrate deploy
```
#### You want to see the Prisma DB Locally
```
npx prisma studio
```

    