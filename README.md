
# gfcf14 Shared Backend Architecture
This repository is a backend service created to serve multiple frontend projects with similar requests/needs.

## Description
The gfcf14's Shared Backend Architecture is a web service which receives communications from frontend applications to fetch records from a remote database to display them sorted by date, or a specific record from a specific page as noted by the record's date. The project also features basic authentication, where only an authorized user (me) would be able to access to create new records. This works because the frontend applications which depend on it have similar needs. These are:

- [WebDevToons](https://webdevtoons.vercel.app/), which uses two repositories: [frontend](https://github.com/gfcf14/webdevtoons-frontend) and [backend](https://github.com/gfcf14/webdevtoons-backend)
- [gfcf14's Art](https://gfcf14-art-cjhfgxdxe8c6eree.eastus2-01.azurewebsites.net/), which uses two repositories: [frontend](https://github.com/gfcf14/gfcf14-art) and [backend](https://github.com/gfcf14/gfcf14-art-backend)

## Purpose
Although I initially had dedicated backend services for the frontend applications mentioned above (WebDevToons's backend was hosted in Render, gfcf14's Art's backend was hosted in Azure), because I had them hosted in different providers by taking advantage of their free tier these backend services would incur some time to start (aka cold start), which would significantly worsen user experience. Having used Vercel in the past for NodeJS applications and not experiencing significant delays in application load times I decided to create a backend service for the apps that, given the simplicity of their backend services, would be able to serve them both.

## Basic Data Flow
![enter image description here](https://github.com/gfcf14/gfcf14-sba/blob/main/sba-simple.jpg?raw=true)
The shared backend architecture consists of one backend application written in NodeJS which currently accepts calls from 2 frontend applications (WebDevToons is written in Angular and gfcf14's Art is written in Blazor), to then communicate with a remote PostgreSQL database hosted in Supabase.

## Complete Data Flow
![enter image description here](https://github.com/gfcf14/gfcf14-sba/blob/main/sba-complete.jpg?raw=true)
The complete data flow in the backend involves a basic configuration which blocks all incoming communications except those that are allowed as per CORS configuration. Successful communication beyond this is handled by  one common controller, the user controller which connects to a user service to verify login to provide a token. The post and artwork controllers then are controllers meant to handle requests from their respective applications, to then call functions in their services to fetch/create records in the db. All of the services make use of a postgreSQL connection pool.

## Considerations

Though this basic setup works efficiently for data flow across similar applications and as such I should be able to implement more applications as need arises, I might need to consider different means of hosting if my applications start receiving considerable traffic. I would also need to constantly update the simple data flow image if and when I decide to add a new frontend application to leverage this backend service.