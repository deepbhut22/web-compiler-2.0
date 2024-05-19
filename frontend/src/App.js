import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';
import './App.css'; // Import your CSS file for styling

const App = () => {

  const defaultCodes = {
    c:`#include<stdio.h>

int main() {

}
    `,
    "c++":`#include<iostream>
using namespace std;

int main() {

}
    `, 
    java:`class Solution {
  public static void main(String args[]) {
    System.out.println("hello");
  }
}`,
    rust:`fn main() {
  // Your Code Goes Here
}`,
    solidity:`pragma solidity ^0.8.0;

    contract Solution {
      function sayHello() public pure returns (string memory) {
        return "Deep Bhut";
      }
    }`,
    python: `// your code goes here`
  };

  const expectedOutput = {
    easy: "hello\n",
    medium: "hello 2+2 = 4\n",
    hard: "hello 2*2 = 4\n"
  };

  const [language, setLanguage] = useState('rust');
  const [difficulty, setDifficulty] = useState('easy');
  const [code, setCode] = useState(defaultCodes.rust);
  const [output, setOutput] = useState("");
  const [verified, setVerified] = useState(Boolean);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const temp = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const compileCode = async () => {
    try {
      setLoading(true);
      // Dcoded < Making request to backend for compiling the code >
      const response = await axios.post('http://localhost:5000/compile', { language, code, difficulty });
      // console.log(response);

      // Dcoded < Setting output according to the language >
      if (language === "solidity") {
        const output = response.data.output.contracts["temp_code.sol:Solution"];
        setOutput("bin string : " + output.bin);
        setVerified(response.data.verify);
        response.data.verify === true && setTotalPoints(prev => prev + temp[difficulty]);
        setLoading(false);
        return;
      }
      const output = response.data.output;
      setVerified(response.data.verify);
      setOutput(output);
      response.data.verify === true && setTotalPoints(prev => prev + temp[difficulty]);
      setLoading(false);
      // Dcoded < Setting varified or not, according to response >
    } catch (error) {
      setLoading(false);
      setOutput(`Error: ${error.message}`);
    }
  };

  // Dcoded < changing the selected language >
  const changeLang = (e) => {
    setLanguage(e.target.value);
    setCode(defaultCodes[e.target.value]);
  };

  return (
    <div className="App">
      <h1 className="title">Web - Compiler</h1>
      <div className="dropdowns">
        <div className="lang">
          <label>Language: </label>
          <select value={language} onChange={e => changeLang(e)}>
            {/* <option value="solidity">Solidity</option>
            <option value="rust">Rust</option> */}
            <option value="c">C</option>
            <option value="c++">C++</option>
            <option value="java">Java</option>
            <option value="python">python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div className="difficulty">
          <label>Difficulty: </label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <p className='expop'>Expected Output : {expectedOutput[difficulty]}  </p>
      </div>
      <div className="workspace">
        <div className="editor">
          {/* Dcoded < Code for editor > */}
          <MonacoEditor
            language={language}
            value={code || defaultCodes[language]}
            height={500}
            onChange={newValue => setCode(newValue)}
            options={{ selectOnLineNumbers: true }}
            theme="vs-dark"
          />
        </div>
        <div className="output">
          <div className="opHeading">
            <h3>Verified : {verified === true ? "Yes " : "No "}</h3>
            <h3>Points Earned : {
              verified === true ? difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3 : 0
            }</h3>
            <h3>Total points : {totalPoints}</h3>
          </div>  
          {!loading ? <div className="actualOp">
            <h2>Output:</h2>
            <p className='ppp'>{output}</p>
          </div>
          :
          <h1>Loading...</h1>  
        }
        </div>
      </div>
      <button className="button" disabled={loading} onClick={compileCode}>Run</button>
    </div>
  );
};

export default App;
