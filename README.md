# CompileOnix

<p align="center">
  <img src="https://socialify.git.ci/Bhavishya2601/Compileonix/image?font=Raleway&language=1&name=1&owner=1&pattern=Floating+Cogs&theme=Dark" alt="CompileOnix" />
</p>

**CompileOnix** is a real-time collaborative code compiler platform that supports C, C++, Java, and Python. It allows users to compile and run code, collaborate with others in shared rooms, and track each participant's mouse movements in real-time. User authentication ensures a secure coding environment.

---

## Features

### 1. Multi-language Code Compilation
- Supports C, C++, Java, and Python.
- Compile and run code directly from the browser.

### 2. Real-time Collaboration
- Create or join rooms for shared coding sessions.
- All code changes are reflected instantly across all participants.

### 3. Mouse Movement Tracking
- Tracks and displays each participant's mouse movements in real-time.
- Each user's cursor is distinguished by a unique color and label.

### 4. Real-time Communication
- Enables real-time communication among participants in a room to facilitate effective collaboration.

### 5. Secure Authentication
- Users must authenticate before accessing the platform to ensure secure collaboration.

---

## Getting Started

### Prerequisites
- **Node.js** v14.0 or higher
- **MongoDB** for database management
- A web browser (Chrome, Firefox, or Edge recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bhavishya2601/CompileOnix.git
   ```

2. Navigate to the project directory:
   ```bash
   cd CompileOnix
   ```

3. Navigate to the client directory:
   ```bash
   cd client
   ```

4. Install client dependencies:
   ```bash
   npm install
   ```

5. Set up environment variables for the client:
   - Create a `.env` file in the `client` directory.
   - Add the following variables from `.env.sample`.

6. Start the server:
   ```bash
   npm run dev
   ```

7. Open a new terminal and navigate to the server directory:
   ```bash
   cd ../server
   ```

8. Install server dependencies:
   ```bash
   npm install
   ```
9. Set up environment variables for the server:
   - Create a `.env` file in the `server` directory.
   - Add the following variables from `.env.sample`.

9. Start the server:
   ```bash
   nodemon index.js
   ```

---

## Usage

### Authentication
- Register or log in to access the platform.

### Creating a Room
1. Click the "Create Room" button.
2. Share the generated room ID with collaborators.

### Joining a Room
1. Enter the room ID provided by the room creator.
2. Start collaborating in real-time.

### Mouse Movement Tracking
- Mouse movements will automatically be displayed for all participants in the room.

### Running Code
- Write your code in the editor.
- Select the programming language from the dropdown.
- Click "Compile" to compile and execute the code.

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **WebSockets:** Socket.io for real-time collaboration
- **Authentication:** JSON Web Tokens (JWT)

---

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add your feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Contact

For any questions or feedback, feel free to reach out:
- **Email**: bhavishya2601garg@gmail.com
- **GitHub**: [bhavishya2601](https://github.com/bhavishya2601)

