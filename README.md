# VillageLink

![GitHub last commit](https://img.shields.io/github/last-commit/kaitlynmalsky/cs326-g40-project-repo)

_Created in Spring 2024 for CS 326 by Enver Amboy, Matthew Kotchkin, Kaitlyn Malsky, Sreyas Rajasekharuni, and Shivay Wadhawan (group 40)._

VillageLink is a web application that makes it simpler and easier to make new friends on campus, with the help of pins that help you find out where and when people are hanging out, in real time. Using the application to meet new people will grow your _village_, consisting of a collection of the people you have met up with along the way. You can then go on to meet more people, growing your own village, and gaining access to the villages of other users. Villages serve as a fun, intuitive way to visualize social connections.

## Installation and Setup

To view the older milestone submissions, download the repository and enter `npm run milestone-01` (Project Planning) for Milestone 1 or `npm run milestone-02` for Milestone 2 (Frontend). The milestone you run will open in [http://127.0.0.1:3000](http://127.0.0.1:3000).

To run milestone 3 (Backend) download the repository and enter `npm run start` into the terminal.
Alternatively, you can visit our domain at [https://villagelink.fly.dev](https://villagelink.fly.dev/#login)!

## How to use

To use VillageLink, you need to first create an account.

In the **Profile** section, you can customize and save your avatar.

To post an event, go to the **Map** section and click **Add Pin**. Enter a start time and end time for your event, and add details. _The application is built with short-term events in mind, so the implication is that the event is today. Set a start time after the current time._ You can also select a current pin to join it.

Once you create or join a pin, a new group chat will be created. This chat can be seen in **Messages**.

Once a pin's event has expired, the application will prompt you to add a village connection to other pin attendees. These prompts, along with your villages and your friends' villages, are visible in **Villages**.

## Routes

| Route | Method | Description | URL Parameters | Body | Requires Authentication? 
| -------- | ------- | ------- | ------- | ------- | ------- |
| `/api/login` | POST | Logs the user in using the given email and password. | none | email, password | No
| `/api/logout` | GET | Logs out the current user. | none | none | Yes
| `/api/signup` | POST | Adds a new user to the database with the given attributes and logs them in. | none | username, name, avatar, avatarConfig, email, password | No
| `/api/users/` | GET | Gets a user with the given email or user ID. Only requires one of the stated URL parameters. If both are given, use email. | email, userID |  none | No
| `/api/users/:userID/connections/` | POST | Creates a bi-directional connection between userID and targetID. | userID | targetData | No
| `/api/users/:userID/connections/` | GET | Get all connections of userID. | userID | none | No
| `/api/users/:userID/connections/:targetID` | DELETE | Deletes the connection between userID and targetID. | userID, targetID | none | No
| `/api/users/me` | GET | Get current user. | none | none | Yes
| `/api/users/:userID` | GET | Get the user with the given userID. | userID | none | No
| `/api/users/:userID/suggestions/:targetID` | DELETE | Delete the given connection suggestion. | userID, targetID | none | No
| `/api/users/:userID/suggestions/` | GET | Get the connection suggestions of the user with the given userID. | userID | none | No
| `/api/pins/` | POST | Create a new pin with the given data. | none | startTime, endTime, details, coords | Yes
| `/api/pins/` | GET | Get all filtered pins with given type. | type | none | No
| `/api/pins/:pinID/attendees/` | GET | Get attendees of the given pin. | pinID | none | No
| `/api/pins/:pinID/attendees/` | POST | Join given pin as an attendee. | pinID | none | Yes
| `/api/pins/:pinID/attendees/:attendeeID/` | DELETE | Leave a pin as an attendee. | pinID, attendeeID | none | Yes
| `/api/pins/:pinID` | GET | Gets a pin with the given ID. | pinID | none | No
| `/api/pins/:pinID`| PUT | Updates the given pin if the current user is the host. | pinID | none | Yes
| `/api/pins/:pinID` | DELETE | Deletes the given pin if the current user is the host. | pinID | none | Yes
| `/api/groups/` | GET | Returns a list of groups (pins) that the current user is a part of. | none | none | Yes
| `/api/groups/:groupID/messages/` | POST | Send a message to the given group chat. | groupID | content, timeString | Yes
| `/api/groups/:groupID/messages/` | GET | Get messages from a group chat. | groupID | none | Yes

### Map View

Creating an account will give you access to the map view, where you can see your own pins and other people's pins. To create a new pin, click the **Add Pin** button, which will add your new pin to the center of the map. You can drag this new pin to any location you want on the map. Once you have chosen a location for your pin, specify the start time, the end time, and details of the hangout you want to schedule and click **Post** when you're done. This will add your pin to the map and make it visible to other users. You can also edit and delete your existing pins by clicking it again. You can view other people's pins and click the **Join** button to become part of their group.

### Message view

Once you have joined in a meetup, you will be able to access the message view to communicate with other people from that group. Choose the group chat you want to communicate with using the sidebar on the left.

### Village view

This is where you can see your village, i.e. the people you have met on past hangouts. You can click a user to see their village. _You can't see the villages of people in your friend's villages - this system only extends to friends-of-friends, not friends-of-friends-of-friends_.

### Profile view

Customize your own profile by creating a cute animal avatar and changing your displayed name. This information will be visible to other users on the map, in your village, or in your friends' villages.
