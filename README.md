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

### [Operating System](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-os.mjs)

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

I opted to create a robot as a virtual pet for my coursework as I wanted to do something different from my classmates and the fact that I found the concept of a robot as a virtual pet to be very cool.

In order to enhance the interaction of my virtual pet, I integrated a user text response feature inspired by ChatGPT, a language model developed by OpenAI. ChatGPT is based on the GPT-3.5 architecture, and has the ability to generate text that resembles human language in response to user prompts. To implement this feature, I created my own simple text processor engine which can process user input and generate friendly, human-like responses.

From my Database Management Systems (DBMS) classes, I learned about the benefits of using DBMS, which are software tools designed to facilitate efficient communication between a database and a user's application. Using this knowledge, I developed my own custom DBMS to manage my entire robot database.

To modularize my project, I attempted to display the different parts (files) that constitute the entire robot and its capabilities. To accomplish this, I drew inspiration from my core first-year courses: Database Management Systems (DBMS), Networks, Architecture and Operating Systems, and Application Programming. That is why I named my JavaScript files as so:

- "robot-game-processor.mjs": contains all the functions that manage the complete game process of the robot, including starting the game, running the main game logic, and ending the game.

- In "robot-network-drivers.mjs": you can find all the functions that utilize the browser's fetch API. This API enables web applications to send network requests to servers and receive responses from them. The file includes functions that make network requests to update, get, create, and delete robot data, and their respective server responses sent to different parts of the robot application for use.

- "robot-operating-system.mjs": contains the core functions of the robot as the name suggests. The file includes functions that assist the robot in processing various user inputs, handle quick read/write actions to the robot's storage unit, allow the robot to calculate and display its various values and mood, and more.

- "robot-global-store.mjs": includes variables that are accessed in multiple files within the robot's file structure. To implement this, I drew inspiration from the Redux store concept, which is a global statement management system designed to simplify accessing and mutating data across an application. Since it was becoming cumbersome to manage data that frequently changed within a single file where it's used the most, I created the "robot-global-store" file to provide easy read and write access to variables that are accessed in multiple places within the application.

- "robot-text-processor.mjs" includes the function that takes parsed user input, runs it through a simple text processor, and responds with a user-friendly output message. To implement this feature, I drew ideas from the ChatGPT user text reponse funtionality.

## Conclusion

In conclusion, working on this coursework project provided me with valuable lessons. I gained a deeper understanding of why certain software tools were created and the challenges they aim to solve, such as Redux and Database Management Systems. This helped me appreciate their usefulness better. I also learned how to use tools like ChatGPT to help me write good code documentation and comments, which is important for creating maintainable and understandable code.

## Refrences

OpenAI. (2021). ChatGPT [Computer software]. https://openai.com/blog/chat-gpt-3-6b/

