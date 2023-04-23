# Robot Dojo

Welcome to Robo Dojo Inc.! a web application that provides you with the ability to create, own, and interact with a virtual pet robot. I opted to create a robot as a virtual pet for my coursework as I wanted to do something different from my classmates and the fact that I found the concept of a robot as a virtual pet to be very cool.

## About The Project

This section provides an overview of the various components and files that comprise the robot app, as well as their respective functions. Its objective is to provide a high-level understanding of the entire application and how all the pieces fit together.

The project is divided into two main parts, which are:

### [Server Side](https://github.com/devevangel/my-virtual-pet/blob/main/server.js)

This refers to the part of the application that handles all network requests made from the client side and sends a response accordingly. It houses the database, a universal storage location for the entire app, the Database Management Systems (DBMS), which provides an efficient way of communicating with the database and the client side through the use of queries sent from the client side. Finally, the controllers these are functions that are called when certain conditions are met. They communicate with the DBMS and the client side. Here are the components/files that make up the server side:

#### [Robot Database](https://github.com/devevangel/my-virtual-pet/blob/main/database/robots-database.json)

This is a lightweight JSON global storage location for the entire application. It houses data about every user currently signed up on the application and their respective robot pets in a key-value pair format. The database provides every user with the ability to access their pet from any machine or mobile device. Here is a sample of the database structure:

```json
{
        "232543224532": {
        "id": "R7fUN",
        "name": "Javis",
        "owner": "232543224532",
        "timeLived": "2023-04-21T04:50:33.076Z",
        "skinclass": "robo-orange",
        "version": 6,
        "chargePercent": 90,
        "cachePercent": 100,
        "cacheList": []
    }
}

```

#### [Robot Database Manager](https://github.com/devevangel/my-virtual-pet/blob/main/database/database-manager.js)

This is a simple custom-built JavaScript class that handles direct communication with the robot JSON database. It exposes top-level functions that provide the ability to add new object data to the database, update existing object data, retrieve object data, and delete object data. I decided to implement this feature because during the development period of this project, I was learning about Database Management Systems (DBMS), specifically PostgresSQL. A DBMS is a software tool that provides an efficient way to communicate between a database and a user-facing application. It prevents direct user communication with the database, which could lead to data corruption or ultimately data loss.

#### [Robot Controller](https://github.com/devevangel/my-virtual-pet/blob/main/controllers/robot.js)

These are a set of functions that carry out specific tasks when called. Each function takes a request and response parameter that enables them to accept requests from the client side and send a response. The functions are mounted on routes, and whenever a route is hit from the client side, the respective function is called, and a response is sent accordingly. These functions make use of the top-level functions exposed by the robot DBMS to perform certain tasks in the robot database and provide a suitable response to the client side. The robot controller contains functions that handle signing up and creating a new pet, getting an existing robot pet, updating a robot pet, as well as deleting a robot pet from the robot database.

### [Client Side](https://github.com/devevangel/my-virtual-pet/tree/main/client)

this refers to the part of the application that is closer to the user. It contains all the code responsible for handling the main logic of the application that the user sees and interacts with. The front-end is responsible for showing the user interface and providing output to user interactions. Additionally, it is responsible for making network requests to the server-side.

The components and files that make up the client-side include:

#### [Robot Global Storage](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-global-store.mjs)

The Robot Global Store has two components: the Robot JSON Local Storage Unit, which holds information about the robot on the user's machine, and the Robot Global Store file. The Robot Global Store provides global read/write access to certain robot variables that are accessed and modified at various locations in the Robot file structure.

The decision to use a global store approach was made because of issues with different files within the client app frequently accessing and modifying some Robot variables. These files didn't necessarily have a direct relationship with each other. Having those variables in a single file that was exported and imported where needed became difficult to manage and maintain. Therefore, the global store was created as a solution that allows all files within the Robot client-side to access and modify those variables. For example, the 'roboState' variable is used 17 times in the 'game processor' file, 36 times in the 'operating system' file, and 6 times in the 'text-processing' file. Although these files don't necessarily relate to each other, they access and modify the same variable. Moving it to a global store improves maintainability and makes it easier to access variables that change frequently within the app.

```javascript

const roboState = {
  maxCache: 10,
  guessVal: 0,
  isGameInit: false,
  isGameStarted: false,
  isSleeping: false,
  isError: false,
  isTyping: false,
  isDead: false,
};

export { roboState }
```

#### [Robot Text Processor](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-text-processor.mjs)

This is the component of the robot responsible for processing user text input to enable the robot provide useful responses or output. 80% of the robots funtionality can be accessed via the text processor. The text processor makes use of a very simple text processing system which has the potential to be developed into a more complex system to better handle user input as well improve robot responses. This processor also helps in determining the current mood of the robot which includes: Very Happy 😄| Happy 🙂| Sad 😥| Angry 😡| Sleeping 😴| Gaming 🎮| Dead ☠️

#### [Robot Game Processor](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-game-processor.mjs)

This is an extenstion of the text processor. The game processor component of the robot handles the gamplay process within the app. It provides the abliltiy to play a guess the number game where the robot generates a random number between a given min and max value and the user tries to guess the number right. This processor helps in updating the robot game mode.

#### [Robot Operating System](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-operating-system.mjs)

This is the major component of the entire robot as it controls all other aspects of the robots. It's functions include:
- Memory managemnt and usage
- Display of the various robot stats
- Calculations of variaous values
- Handles game play initialization
- Powering on and loading stored data
- Handles version updates
- Error handling and display
- Making network requests

#### [Robot Network Calls](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-utils.mjs)

This file contains all the functions that allow the client-side to make network requests to the Robot server and send the server response data to various parts of the robot application where it's needed. The file contains functions that:

- make POST requests to create a new pet with the user-inputted details

- make GET requests to get data about an existing pet

- make PATCH requests to update data of an existing pet

- make DELETE requests to delete data about an existing pet.


## Robot Components

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

## About ChatGPT

ChatGPT was used in my application to help in writing code documentation, as well as code comments. I found this very much helpful, as it was able to save time, and most of the time, it gave near-perfect documentation and code comments.

ChatGPT is an AI language model that uses deep learning algorithms to generate human-like responses to natural language inputs. It can be used for various applications, including writing code documentation and comments. With ChatGPT, developers can save time by generating code comments and documentation quickly and accurately. Additionally, the generated documentation and comments are often near-perfect, reducing the need for extensive manual editing. Overall, ChatGPT can significantly improve the productivity and efficiency of software development teams.

## Conclusion

 I would like to say that there is always room for improvement within the codebase. Functions can be written better, and files and folders could be structured in a more efficient way. However, one of the major reasons I chose the current structure of my codebase was to avoid issues of plagiarism. Many students asked me to explain the reasoning behind my coding patterns and ideas, and I often had to teach and provide practical help to them. Occasionally, some of them took a sneak peek at my codebase to borrow a few ideas, which was why I had to be cautious. Nonetheless, I am proud of what I have accomplished so far and look forward to improving my coding skills in the future.

## Refrences

OpenAI. (2021). ChatGPT [Computer software]. https://openai.com/blog/chat-gpt-3-6b/

Google. (2019). Google Fonts. Google Fonts. https://fonts.google.com/

Cpu Emojis | 🏿🖥⚡🖥️ | Copy & Paste. (n.d.). Emojidb.org. Retrieved April 22, 2023, from https://emojidb.org/cpu-emojis

‌


