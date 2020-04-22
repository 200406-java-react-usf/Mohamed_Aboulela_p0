# Mohamed_Aboulela_p0

For Project 0, I will be building a RESTful API using TypeScript and Express. This API will be a social media API that takes in users, their astrology signs, and their horoscopes. The relationship of these objects are based on the user's birthday and astrology sign in which said user was born.

Suggestions: 
- resource management system API
- learning management system API
- any kind of social media API
- mobile banking application API

## Features
- [ ] RESTful API (At least Level 2 of the [Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html))
- [ ] Documentation (all methods have basic documentation)
- [ ] Unit testing (>= 80% coverage)
- [ ] SQL Data Persistance (at least 3 tables; all 3NF)
- [ ] Logging (extra)
- [ ] Authentication/Authorization (extra)

## Tech Stack
- [ ] TypeScript
- [ ] PostGreSQL
- [ ] node-postgre
- [ ] Express
- [ ] Jest
- [ ] Git SCM (on GitHub)

## Init Instructions
- Select a project idea and submit it to trainer for approval. Be sure to include:
  - The 3 data entities that you will be persisting
  - Any external APIs that you will be using (not required if none are used)
- Once approved, create a new repository within this organization (naming convention: `firstname_lastname_p0`)

## Presentation
- [ ] 5 minute live demonstration of endpoint consumption using Postman

## Entities
- [ ] User {id, first name, last name, usernname, password, birthdate}
- [ ] AstrologyProfile Sign {id, birthdate, sign, AstroId}
- [ ] Horoscope {id, sign, message, AstroId}
