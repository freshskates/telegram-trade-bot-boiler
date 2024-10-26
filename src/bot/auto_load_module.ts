/* 

This file allows for the automatic importing of modules 


Purpose:
    In order for the "bot" variable to register callback functions, conversations, etc..
    without importing them within the bot.ts file, this file was created to
    import all files given a target directory. 

    Basically, because we don't want bot.ts to be populated with a bunch
    of imports and bot registration of functionality, we 

Important Notes:
    THIS FILE ASSUMES YOU ARE RUNNING USING Node.JS OTHERWISE THE CODE BELOW MIGHT NOT WORK.

Notes:

*/
import * as fs from "fs/promises";

import path, { resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";

// ##### START OF DEBUGGING AND TESTING #####

// //@ts-ignore
// console.log(`${new URL(import.meta.url).pathname} 1`);
// //@ts-ignore
// console.log(`${path.dirname(new URL(import.meta.url).pathname)} 2`);
// //@ts-ignore
// console.log(`${process.cwd()} 3`);
// //@ts-ignore
// console.log(`${import.meta.url} 4`);
// //@ts-ignore
// console.log(`${fileURLToPath(import.meta.url)} 5`);
// //@ts-ignore
// console.log(`${path.dirname(fileURLToPath(import.meta.url))} 6`);
// //@ts-ignore
// console.log(`${path.dirname(pathToFileURL(import.meta.url).href)} 7`);
// //@ts-ignore
// console.log(`${resolve(path.dirname(fileURLToPath(import.meta.url)))} 8`);
// //@ts-ignore
// console.log(`${pathToFileURL(resolve(path.dirname(fileURLToPath(import.meta.url)))).href} 9`);

// ##### END OF DEBUGGING AND TESTING #####

async function get_files_from_dir_all(directory: string): Promise<string[]> {
    let array_path_file: string[] = [];

    const array_file = await fs.readdir(directory, { withFileTypes: true });

    for (const file of array_file) {
        const path_file_abs = path.join(directory, file.name);

        // If directory, check sub directories
        if (file.isDirectory()) {
            const array_path_file_sub = await get_files_from_dir_all(
                path_file_abs
            );

            array_path_file = array_path_file.concat(array_path_file_sub);

            // If file
        } else {
            array_path_file.push(path_file_abs);
        }
    }

    return array_path_file;
}

/**
 * Check if a module is loaded...
 *
 * Refernece:
 *      Module API to check if a module has been loaded #1381
 *          Date Today:
 *              10/18/2024
 *          Notes:
 *
 *          Reference:
 *              https://github.com/nodejs/node/issues/1381
 *
 * @async
 * @param {string} path_module
 * @returns {Promise<boolean>}
 */
async function check_if_module_is_loaded(
    path_module: string
): Promise<boolean> {
    try {
        // Check if the module is in the cache
        return !!require.cache[require.resolve(path_module)];
    } catch (error) {
        // If require.resolve throws an error, the module is not loaded
        return false;
    }
}

//@ts-ignore
const PATH_FILE_THIS_FILE = fileURLToPath(import.meta.url);
const PATH_DIRECTORY_THIS_FILE = path.dirname(PATH_FILE_THIS_FILE);
const ARRAY_FILE_EXTENSION = [".ts", ".js"];

interface ModuleContainer {
    message: string;
    module: string | null;
    path: string;
}


/**
 * This function will properly load the modules in parallel
 * 
 * Notes:
 *      Use the code below to test it
 *          await new Promise(r => setTimeout(r, 2000));
 * 
 * Reference:
 *      What is the JavaScript version of sleep()?
 *          Reference:
 *              https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep * @async
 * @param {string} path_
 * @param {string[]} array_path_file_to_ignore
 * @returns {Promise<ModuleContainer>}
 */
async function _load_module(
    path_: string,
    array_path_file_to_ignore: string[]
): Promise<ModuleContainer> {
    
    /* TESTING IF THIS IS ACTUAL IN PARALLEL */  // YES IT'S IN PARALLEL
    // console.log(`Start ${path_}`)
    // const time = Math.random() * 5000
    // await new Promise(r => setTimeout(r, time));
    // console.log(`End ${path_}: ${time} `)
    
    // Skip files that should be ignored (Should be used to prevent recursively importing)
    if (array_path_file_to_ignore.includes(path_)) {
        return { message: "Module ingorned", module: null, path: path_ };
    }

    // Skip already loaded modules
    if (await check_if_module_is_loaded(path_)) {
        return { message: "Module already loaded", module: null, path: path_ };
    }
    
    const full_file_path = resolve(path_);

    // Skip importing this file (as in this actual file) to prevent recursively importing files
    if (PATH_FILE_THIS_FILE.localeCompare(full_file_path) == 0) {
        return { message: "Module is this file", module: null, path: path_ };
    }

    const path_file = pathToFileURL(full_file_path).href;

    // Import module
    const module = await import(path_file);

    return { message: "Module loaded", module: module, path: path_ };
}

/**
 * Load modules without explicitly importing given a directory path
 * 
 * @async
 * @param {string} [path_directory_file=PATH_DIRECTORY_THIS_FILE]
 * @param {string[]} [array_path_file_to_ignore=[]]
 * @returns {*}
 */
async function auto_load_modules_from(
    path_directory_file: string = PATH_DIRECTORY_THIS_FILE,
    array_path_file_to_ignore: string[] = []
) {
    let array_file: any[] = [];

    try {
        array_file = await get_files_from_dir_all(path_directory_file);
    } catch (error) {
        // console.error('Error reading directory:', error);
        throw error;
    }

    const array_file_filtered = array_file.filter((file) => {
        const extention_of_file = path.extname(file);

        // Check if file extension is .ts or .js
        return ARRAY_FILE_EXTENSION.includes(extention_of_file);
    });

    const array_promise_module_container: Promise<ModuleContainer>[] =
        array_file_filtered.map((path_) => {
            return _load_module(path_, array_path_file_to_ignore);
        });

    try {
        const array_module_container: ModuleContainer[] = await Promise.all(
            array_promise_module_container
        );

        array_module_container.forEach((module_container: ModuleContainer) => {
            console.log(`${module_container.message}:`, module_container.path);
        });
    } catch (error) {
        // console.error('Error:', error);
        throw error;
    }
}

export default auto_load_modules_from;
