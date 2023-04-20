# Robot Dojo

Welcome to Robo Dojo Inc.! a web application that provides you with the ability to create, own, and interact with a virtual pet robot.

## Robot Components 

This section provides an overview of the various components that make up the robot and their respective functions. It aims to give a high-level understanding of the entire application and how all the pieces fit together.

### [Storage](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-registers.mjs)

This consist of the Robo Dojo main database located on the server, the robot in app JSON storage unit which makes use of the browser localstorage, the main robot cache memory that stores user command history built on top of the JSON localstorage unit and the robot RAM which is a volatile in runtime storage unit.

- Custom built JSON database and Database Management System [DBMS](https://github.com/devevangel/my-virtual-pet/blob/main/database/database-manager.js) (server).
- In app JSON based quick read/write storage unit (localstorage - client).
- Robot main cache memory (an implementation of the in app JSON localstorage unit - client).
- Runtime storage unit (RAM - client)

### [Text Processor](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-text-processor.mjs)

This is the component of the robot responsible for processing user text input to enable the robot provide useful responses or output. 80% of the robots funtionality can be accessed via the text processor. The text processor makes use of a very simple text processing system which has the potential to be developed into a more complex system to better handle user input as well improve robot responses. This processor also helps in determining the current mood of the robot which includes: Very Happy, Happy, Sad, Angry, Sleep and Dead. 

### [Game Processor](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-game-processor.mjs)

This is an extenstion of the text processor. The game processor component of the robot handles the gamplay process within the app. It provides the abliltiy to play a guess the number game where the robot generates a random number between a given min and max value and the user tries to guess the number right. This processor helps in updating the robot game mode.

### [Network Driver]()

This is the component resposible for handling all network requests that the robot needs to make. It sends the data gotten from network requests to various parts of the robot where it's requried. It also sends all possible errors to the error handling compoent where its processed to output useful error messages where necessary.

### [Operating System]()

This is the major component of the entire robot as it controls all other aspects of the robots. It's functions include:
- Memory managemnt and usage
- Display of the various robot stats
- Calculations of variaous values
- Handles game play initialization
- Powering on and loading stored data
- Handles version updates
- Error handling and display
- Making network requests

### Battery

This is the robots power unit, it has to be charged from time to time to keep the robot alive.

### Display Unit

This the component that handles displaying and updating the user interface(UI) of the robot. it displays the following info:

- Robot pet name
- Power level in percentage
- Memory Capacity/Usage in percentage 
- Time lived
- Mood : Very Happy 😄| Happy 🙂| Sad 😥| Angry 😡| Sleeping 😴| Gaming 🎮| Dead ☠️
- Robot text response
- Robot Warings and Errors

### Error Handler

This is also a very necessary and important component of the robot. It manages all possible errors and unexpected behaviours that may occur during the usage of the web application. Here are some of the major errors handled in the app.

- Network errors: This has to do with all erors that may occur during the process of making network requests.
- Storage malfunction errors: This has to do with errors that occur as a result of damage to the localstorage of the robot.
- User generated errors: This has to do with errors that are caused by the user interaction.
- Malfunctions: This has to do with unexpect errors or exceptions

### Button Controls

This consist of buttons that provides the user ablility to control certain aspects of the robot. these functions includes:

- Feed Me(chage robot)
- Sleep/Awaken robot
- Clean Cache
- Update OS


## Robot Features

- Ability to tell the time

- Ability to tell the current date

- Ability to play a simple text based game

- Ability to display its feelings or emotions

- Ability to store and display previous user inputs and command history from it's cache memory

- Ability to clear cache memory

- Ability to Sleep/Awaken

- Ability to Change it's designated name on user command

- Ability to update it's OS on user command

- Ability to display usage manual or game guide when the command 'help' is entered

- Ability to provide text based response to user commands

- Ability to store, calculate and display total time lived

- Ability to check it's curernt OS version on user command

## Robot User Control Features

- Button to charge robot
- Button to sleep/wake robot
- Button to clean cache
- Button to update OS



## How To Use

1. Clone the repository to your local machine.
2. Run `npm install` to install the necessary dependencies.
3. Run `npm start` to start the app.
4. Open `http://localhost:8080` in your web browser.
5. Create a new pet or get your existing pet.
6. Start interacting with your robot pet.

## About My Course Work

For my virtual pet coursework, I chose to create a robot as a virtual pet because I believe that machines have become an integral part of our daily lives, contributing to our well-being and quality of life. I thought that a robot as a virtual pet could demonstrate the potential of machines as companions. I drew inspiration for the robot's design heavily from my first-year courses, which included Database Management Systems (DBMS), Networks, Architecture and Operating Systems, and Application Programming.

To increase the engagement of the virtual pet, I incorporated some ideas from ChatGPT's text-based user response system and developed my own text processor engine. This feature enables the robot to receive user input, process it, and provide an appropriate friendly response.

At the core of my project, I aimed to incorporate all the concepts that I had learned so far in the courses mentioned above. Here are a few things I was able to accomplish:

- For my Database Management Systems course, I learned about DBMS (Database Management Systems), how they worked, and the advantages of using them. To manage the robot's database, I built my custom mini DBMS.

- In my Networks course, I learned about computer networking, different network protocols, computer network cards, the Request-Response cycle, and how they worked together to achieve efficient communication over the internet. To enable my robot to make network requests and receive responses, I built my network driver functions utilizing the browser 'fetch API'.

- In my Architecture and Operating Systems course, I learned more about the computer operating system, the Central Processing Unit (CPU), the Arithmetic and Logic Unit (ALU), and how they worked. To control the robot's operating system, I built my custom operating system.

Finally, from learning JavaScript in the Application Programming course, I wrote the entire project in JavaScript.

## Refrences

OpenAI. (2021). ChatGPT [Computer software]. https://openai.com/blog/chat-gpt-3-6b/
