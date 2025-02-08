import path from 'path';
import fs from "fs";
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compileAndRun = async (filePath, language, res) => {
    try {
        const tempDir = path.join(__dirname, '..', 'temp'); 
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true }); 
        }

        let outputPath = path.join(tempDir, 'output.txt');
        let command = '';
        let runCommand = '';

        if (language === 'cpp' || language === 'c') {
            const outFilePath = `${filePath}.out`;
            if (fs.existsSync(outFilePath)) {
                fs.unlinkSync(outFilePath);
            }
            command = `g++ ${filePath} -o ${outFilePath}`;
            runCommand = outFilePath;
        } else if (language === 'java') {
            command = `javac ${filePath}`;
            runCommand = `java -cp ${path.dirname(filePath)} ${path.basename(filePath, '.java')}`;
        } else if (language === 'python') {
            command = `python ${filePath}`;
            runCommand = `python ${filePath}`;
        }

        await new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    reject(`Compilation Error: ${stderr}`);
                } else {
                    resolve(stdout);
                }
            });
        });

        let programOutput = '';
        await new Promise((resolve, reject) => {
            exec(runCommand, (err, stdout, stderr) => {
                if (err) {
                    reject(`Runtime Error: ${stderr}`);
                } else {
                    programOutput = stdout;
                    resolve(stdout);
                }
            });
        });

        res.json({ output: programOutput });
    } catch (error) {
        console.error(error);
        res.status(500).json({ output: error });
    }
};

export const compile = async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!['cpp', 'c', 'java', 'python'].includes(language)) {
            return res.status(400).json({ output: 'Unsupported language' });
        }

        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        let filePath = '';
        if (language === 'cpp') {
            filePath = path.join(tempDir, 'main.cpp'); 
            fs.writeFileSync(filePath, code);
        } else if (language === 'c') {
            filePath = path.join(tempDir, 'main.c'); 
            fs.writeFileSync(filePath, code);
        } else if (language === 'java') {
            filePath = path.join(tempDir, 'Main.java');
            fs.writeFileSync(filePath, code);
        } else if (language === 'python') {
            filePath = path.join(tempDir, 'main.py');
            fs.writeFileSync(filePath, code);
        }

        await compileAndRun(filePath, language, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ output: error });
    }
};
