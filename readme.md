# Robot Dojo

Welcome to Robo Dojo Inc., a web application that gives you the ability to own, create and interact with a robot virtual pet.

## Robot Components 

This sections describes the different components that make a the robot and their various functions. It seeks to provide a high level understanding of the entire application at how it all comes together.

### Storage

This consist of the Robo Dojo main database located on the server, the robot in app JSON storage unit which makes use of the browser localstorage, the main robot cache memory that stores user command history built on top of the JSON localstorage unit and the robot RAM which is a volatile in runtime storage unit.

- Custom built JSON database and database management system (server).
- In app JSON based quick read/write storage unit (localstorage - client).
- Robot main cache memory (an implementation of the in app JSON localstorage unit - client).
- Runtime storage unit (RAM - client)

### Text Processor

This is the component of the robot responsible for processing user text input to enable the robot provide useful responses or output. 80% of the robots funtionality can be accessed via the text processor. The text processor makes use of a very simple text processing system which has the potential to be developed into a more complex system to better handle user input as well improve robot responses. This processor also helps in determining the current mood of the robot which includes: Very Happy, Happy, Sad, Angry, Sleep and Dead. 

### Game Processor

This is an extenstion of the text processor. The game processor component of the robot handles the gamplay process within the app. It provides the abliltiy to play a guess the number game where the robot generates a random number between a given min and max value and the user tries to guess the number right. This processor helps in updating the robot game mode.

### Network Driver

This is the component resposible for handling all network requests that the robot needs to make. It sends the data gotten from network requests to various parts of the robot where it's requried. It also sends all possible errors to the error handling compoent where its processed to output useful error messages where necessary.

### Operating System

This is the major component of the entire robot as it controls all other aspects of the robots. It's functions include:
    - Memory managemnt and usage
    - Display of the various robot stats
    - Calculations of variaous values
    - Handles game play initialization
    - Powering on and loading store data
    - Handles version updates
    - Error handling and display
    - Making network requests

### Battery

This is the robots power unit, it has to charged from time to time to keep the robot alive.

### Display Unit

This the component that handles displaying and updating the user interface(UI) of the robot. it displasy the following info:

- Robot pet name
- Power level in percentage
- Memory Capacity
- Time lived
- Mood : Very Happy 😄| Happy 🙂| Sad 😥| Angry 😡| Sleeping 😴| Gaming 🎮| Dead ☠️
- Robot text response
- Warings and Errors

### Error Handler

This is also a very necessary and important component of the robot. It manages all possible errors and unexpected behaviours that may occur during the usage of the web application. Here some of the major errors handled in the app.

- Network errors: This has to do with all erors that may occur during the process of making network requests.
- Storage malfunction errors: This has to do with errors that occur as a result of damage to the localstorage of the robot.
- User generated errors: This has to do with errors that are cuased by the user interaction.
- Malfunctions: This has to do with unexpect errors or expections.

### Button Controls

This consist of buttons that provides the user ablility to control certain aspects of the robot. this functions includes:

- Feed Me(chage robot)
- Sleep/Awaken robot
- Clean Cache
- Update OS


## Robot Features

- Ability to tell the time

- Ability to tell the current date

- Ability to play a simple text based game

- Ability to display its feelings or emotions

- Ability to store and display previous user inputs and command history using its memory cache

- Ability to clear cache memory

- Ability to Sleep

- Ability to Change it's designated name on user command

- Ability to update it's OS on user command

- Ability to display usage manual or game guide when the command 'help' is entered

- Ability to provide text based response to user commands

- Ability to store, calculate and display total time lived

- Ability to check it's curernt OS version on user command

## Robot User Control Features**

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

## Conclusion

For my virtual pet course work project, I decided to create a robot as the virtual pet. I believe that machines have become an integral part of our daily lives, helping to improve our overall well-being and standard of living. With this in mind, I thought that having a robot as a virtual pet could be a useful way to enhance productivity and well-being.

## Finds

## Refrences


