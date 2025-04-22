# discord.builders toolkit

If you want to help contributing your liblary to discord.builers follow these steps:

1. Download repo:
    ```shell
    git clone https://github.com/StartITBot/discord.builders-toolkit.git
    cd discord.builders-toolkit
    ```

2. Make sure your have Node v16+ installed, then do:
    ```shell
    npm install
    ```

3. Go to 'spec' and create folder with your library name.  Please use only a-z, 0-9 chars.
    ```shell
    mkdir spec/discordpy
    ```

    If you want to support multiple formats use dash symbol. Example: `discordpy-formatname`

4. In your folder create entry file named "main.???.ejs" (ex. main.py.ejs)

To test your spec, generate JSON on https://discord.builders/, paste it in input.json and check output file in the same folder.
