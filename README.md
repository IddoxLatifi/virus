![Header Image](https://cdn.discordapp.com/attachments/1295411620935237683/1351707661489410068/Unbenannt.PNG?ex=67db5b5c&is=67da09dc&hm=92371885bad104334953fc195c7ce253ea8a83c85619bf77a6d621e00388877d&)

# [iddox.tech](https://iddox.tech)

## Build

- **Terminal with Admin Access, Password Requests, and Secret HTMLs**
- **Many Useful Sources and a Small Description in the First Secret File _realsecret_**
- **Clear Build of Terminal / Overlay**
- **Can be run on a custom Domain via GitHub Sites!**

## Directory Structure

- **README.md**  
  This file provides an overview of the project, its structure, and its functionalities.

- **Dockerfile**  
  Contains instructions to build a Docker image for the web server.  
  *Function:* Enables containerized deployment of the website.

- **docker-compose.yml**  
  Configures and orchestrates the containers, including port mapping and service definitions.  
  *Function:* Simplifies starting and managing Docker containers.

- **default.conf**  
  An Nginx configuration file that sets up the web server to serve static files correctly and supports custom domain routing.  
  *Function:* Ensures proper delivery of your website’s resources.

- **HTML Files**  
  - **index.html:** The main page with automatic redirection for mobile users.
  - **about.html:** Contains information about the developer and the project.
  - **contact.html:** Provides contact details or a contact form.
  - **mobile.html:** A mobile-specific page with a message indicating that the full site is available only on PC/Mac.

- **assets/**  
  Contains all static resources such as images and icons.
  - **assets/images/**  
    Includes images like `github.png` and `discord.png` used for external links.

- **js/**  
  Contains JavaScript files that drive dynamic functionality and interactivity.
  - Example: `js/op.js` implements an interactive Tic Tac Toe game featuring a minimax algorithm for bot moves.

- **secret/** (or *realsecret*)  
  A directory containing hidden content and additional resources.  
  *Function:* Provides useful sources along with a brief description in the initial secret file (_realsecret_).

## Implemented Features

- **Dockerization & Deployment**  
  The project is fully containerized. With the Dockerfile and docker-compose.yml, it can be easily deployed in a containerized environment—locally or on a custom domain via GitHub Sites.

- **Responsive Website & Mobile Redirection**  
  The main website is optimized for desktop users. Mobile visitors are automatically redirected to a dedicated mobile page (`mobile.html`) that explains the mobile limitations.

- **Interactive Tic Tac Toe Game**  
  An interactive Tic Tac Toe game built in JavaScript that includes:
  - Player (X) versus Bot (O) gameplay.
  - A minimax algorithm for calculating the optimal move for the bot.
  - Automatic winner detection and game reset after each round.

- **Terminal/Overlay Interface**  
  Demonstrates a terminal-like interface with features such as:
  - Running with admin privileges,
  - Password prompts and secret HTML content display,
  - A clear build and overlay structure.


---

For more detailed instructions, configurations, and code insights, please refer to the individual files and inline comments in the source code.


<h2 align="left">I code with</h2>

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" height="40" alt="docker logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" height="40" alt="python logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg" height="40" alt="visualstudio logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="css3 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="40" alt="git logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" height="40" alt="rust logo"  />
</div>

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=IddoxLatifi&hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=dracula&locale=en&hide_border=false&order=1" height="150" alt="stats graph"  />
  <img src="https://github-readme-stats.vercel.app/api/top-langs?username=IddoxLatifi&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=dracula&hide_border=false&order=2" height="150" alt="languages graph"  />
</div>

