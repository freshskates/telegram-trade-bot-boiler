/* 

This file allows for the automaic importing of modules 

Important Notes:
    THIS FILE ASSUMES YOU ARE RUNNING USING Node.JS OTHERWISE THE CODE BELOW MIGHT NOT WORK.

Notes:

*/
import * as fs from 'fs/promises';

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

//@ts-ignore
const PATH_FILE_THIS_FILE = fileURLToPath(import.meta.url);
const PATH_DIRECTORY_THIS_FILE = path.dirname(PATH_FILE_THIS_FILE);
const ARRAY_FILE_EXTENSION = [".ts", ".js"];


/**
 * Load modules wihtout explicitily importing given a directory path
 * 
 * Notes:  
 *
 * @async
 * @param {string} [path_directory_file=PATH_DIRECTORY_THIS_FILE]
 * @returns {*}
 */
async function auto_load_modules_from(
    path_directory_file: string = PATH_DIRECTORY_THIS_FILE
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

    for (const path of array_file_filtered) {
        try {
            const full_file_path = resolve(path);

            // Skip importing this file as in this actual file to prevent recursive importing
            if (PATH_FILE_THIS_FILE.localeCompare(full_file_path) == 0) {
                continue;
            }

            const fileUrl = pathToFileURL(full_file_path).href;

            const module = await import(fileUrl);

            console.log(
                "Module loaded:",
                fileUrl
                // module
            );
        } catch (error) {
            // console.error('Error:', error);
            throw error;
        }
    }
}

export default auto_load_modules_from;
