# Emotie

_Emotie gives you quick access to your favorite unicode emoticons_

### Dev Setup

1. Clone the project
    ```bash
    git clone <url>
    ```
2. Once in the project root. Install NPM dependencies
    ```bash
    npm install
    ```
3. Compile LESS
    ```bash
    gulp less
    ```
4. Compile React to JavaScript
    ```bash
    gulp js
    ```
5. Watch for changes to your LESS and JS
    ```bash
    gulp
    ```


### Dev Deployment
1. Build LESS and JS (See steps 3 and 4 from Dev Setup above)
2. Navigate to `chrome://extensions`
3. Enable 'Developer Mode' (check box in upper right)
4. Load upacked extension and select the `/extension/` directory in the root of the project