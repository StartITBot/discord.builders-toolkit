import ejs from 'ejs';
import {promises} from 'node:fs';
import writeFileAtomic from "write-file-atomic";
import {glob} from 'glob';
import path from 'node:path';
import chokidar from "chokidar";

const originalError = console.error;
console.error = (...args) => {
    originalError.apply(console, [`\x1b[31m${args.join(' ')}\x1b[0m`]);
};

class ComponentNotExist extends Error {
  constructor(message = "", componentName = "", ...args) {
    super(message, ...args);
    this.message = message;
    this.componentName = componentName;
  }
}

let inputFile = [];
const allModules = {};
const libComponents = {};
const libFileExtensions = {};

async function loadFile(fullPath) {
    console.info("Loading", fullPath);

    const [_, ...strippedPath] = fullPath.split(path.sep);
    const pathUri = './codegen/' + strippedPath.join('/')

    const templateText = await promises.readFile(fullPath, {encoding: 'utf8'})
    let compiled;
    try {
        compiled = ejs.compile(templateText, {
            client: true,  // Generates a reusable client-side function
            strict: true,
            filename: strippedPath.join('/'),
            localsName: 'data',
            compileDebug: true,
            escape: "(markup => JSON.stringify(markup))",
        })
    } catch (err) {
        console.error((err.path || strippedPath.join('/')) + ":", err.message)
        return;
    }


    allModules[pathUri] = {
        default: compiled
    }

    const match = pathUri.match(/^\.\/codegen\/([^/]+)\/main(\.[^/]*)?\.ejs$/);
    if (match) {
        const libName = match[1];
        libComponents[libName] = allModules[pathUri].default;
        libFileExtensions[libName] = match[2]
    }

    return strippedPath[0]

}
function unloadFile(fullPath) {
    console.info("Unloading", fullPath);

    const [_, ...strippedPath] = fullPath.split(path.sep);
    const pathUri = './codegen/' + strippedPath.join('/')
    delete allModules[pathUri]

    const match = pathUri.match(/^\.\/codegen\/([^/]+)\/main(\.[^/]*)?\.ejs$/);
    if (match) {
        const libName = match[1];
        delete libComponents[libName];
        delete libFileExtensions[libName];
        return null; // do not compile lib
    }

    return strippedPath[0]
}

async function compileLib(libName) {
    const mainFunc = libComponents[libName];
    const mainFormat = libFileExtensions[libName];
    let data;
    try {
        data = mainFunc({components: JSON.parse(JSON.stringify(inputFile))}, undefined, importCallback);
    } catch (err) {
        if (err instanceof ComponentNotExist) {
            console.error("Missing file: ./spec" + err.componentName)
            return;
        }
        console.error(err.path + ":", err.message)
        return;
    }
    await writeFileAtomic(`dataset/${libName}${mainFormat}`, data)
}

async function loadInput() {
    console.info("Loading JSON");
    try {
        inputFile = JSON.parse(await promises.readFile("dataset/input.json"));
    } catch (e) {
        console.error("Error in input JSON:", e)
    }
    
}

const importCallback = (name, data) => {
    const mainFunc = allModules['./codegen' + name]?.default;
    if (typeof mainFunc === "undefined") throw new ComponentNotExist(`Component ${name} doesn't exist.`, name)
    return mainFunc(data, undefined, importCallback);
};


(async () => {
    await loadInput();
    const files = await glob("spec/**/*.ejs", {nodir: true})
    for (const fullPath of files) await loadFile(fullPath)


    for (const libName of Object.keys(libComponents)) {
        await compileLib(libName)
    }

    if (process.argv.includes('--watch')) {
        console.info("Started file watcher...")
        const watcher = chokidar.watch(['spec', 'dataset/input.json'], {
            ignored: (path, stats) => (
                path !== "dataset/input.json" &&
                stats?.isFile() &&
                !path.endsWith('.ejs')
            ),
            persistent: true,
            cwd: '.',
            ignoreInitial: true
        });

        const onChange = async (fullPath) => {
            if (fullPath === `dataset${path.sep}input.json`) {
                await loadInput();
                for (const libName of Object.keys(libComponents)) {
                    await compileLib(libName)
                }
                return;
            }

            const libName = await loadFile(fullPath);
            await compileLib(libName);
        }

        watcher
          .on('add', onChange)
          .on('change', onChange)
          .on('unlink', async (fullPath) => {
            if (fullPath === "dataset/input.json") return;
            const libName = await unloadFile(fullPath);
            if (libName !== null) await compileLib(libName);
          })
    }

})();
