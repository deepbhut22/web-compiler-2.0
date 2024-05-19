const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


// Dcoded < stored hash for rust >
const hashes = {
    easy: "5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03", // Dcoded < hello\n >
    medium: "46517e2b493c5efb6c0168d2ec80af92b0542de8fd3fc01e71ae92ddc42a4872", // Dcoded < hello 2+2 = 4\n >
    hard: "e9c6c2429e7f6304658b403276f0989d2bf87126a2374c635560e3cf8086e262", // Dcoded < hello 2*2 = 4 >
};

// Dcoded < Controller for handeling compilation request >
app.post("/compile", (req, res) => {

    // Dcoded < grabing data from request >
    const code = req.body.code;
    const language = req.body.language;
    const difficulty = req.body.difficulty;
    if (!code) {
        return res.status(400).send("No code provided.");
    }
    let scriptPath;
    let codePath;
    
    // Dcoded < choosing appropriate shell script file according to language >
    // if number of languages increases in future we can create a Map that binds eash language with corresponding
    // code file and shell script
    if (language === "c") {
        scriptPath = "./Shell_Scripts/compile_c.sh";
        codePath = "./code_files/c_file.c";
    } else if (language === "c++") {
        scriptPath = "./Shell_Scripts/compile_cpp.sh";
        codePath = "./code_files/cpp_file.cpp";
    } else if (language === "java") {
        scriptPath = "./Shell_Scripts/compile_java.sh";
        codePath = "./code_files/Solution.java";
    } else if (language === "python") {
        scriptPath = "./Shell_Scripts/compile_python.sh";
        codePath = "./code_files/py_file.py";
    } else if (language === "javascript") {
        scriptPath = "./Shell_Scripts/compile_js.sh";
        codePath = "./code_files/js_file.js";
    } else {
        return res.status(400).json({output: "unsupported language."});
    }
    
    fs.writeFileSync(codePath, code, err => {
        if (err) {
            return res.status(500).json("Error storing code in temporary file.");
        }
    });
    // Dcoded < exicuting shell script >
    exec(`sh ${scriptPath} '${codePath}'`, (error, stdout, stderr) => {
        if(stderr) {
            // console.log(stderr);
            return res.json({output: stderr, varify: false});
        }
        // console.log(stdout);
        const op = crypto.createHash("sha256").update(stdout).digest("hex");
        res.json({output: stdout, verify: op === hashes[difficulty]});
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
