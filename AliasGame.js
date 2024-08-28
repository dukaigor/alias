"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AliasGame;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const card_1 = require("@/components/ui/card");
function AliasGame() {
    const [gameStarted, setGameStarted] = (0, react_1.useState)(false);
    const [teams, setTeams] = (0, react_1.useState)(['', '', '']);
    const [currentTeam, setCurrentTeam] = (0, react_1.useState)(0);
    const [currentWord, setCurrentWord] = (0, react_1.useState)('');
    const [words, setWords] = (0, react_1.useState)([]);
    const [skippedWords, setSkippedWords] = (0, react_1.useState)([]);
    const [scores, setScores] = (0, react_1.useState)([0, 0, 0]);
    const [timeLeft, setTimeLeft] = (0, react_1.useState)(60);
    const [isRoundActive, setIsRoundActive] = (0, react_1.useState)(false);
    const [roundScore, setRoundScore] = (0, react_1.useState)(0);
    const [showNextRoundButton, setShowNextRoundButton] = (0, react_1.useState)(false);
    const [showScore, setShowScore] = (0, react_1.useState)(false);
    const [lastWordHandled, setLastWordHandled] = (0, react_1.useState)(false);
    const fileInputRef = (0, react_1.useRef)(null);
    const audioRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const savedState = localStorage.getItem('aliasGameState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            setTeams(parsedState.teams);
            setWords(parsedState.words);
            setScores(parsedState.scores);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (isRoundActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            if (timeLeft <= 3 && audioRef.current) {
                audioRef.current.play();
            }
            return () => clearTimeout(timer);
        }
        else if (timeLeft === 0) {
            endRound();
        }
    }, [isRoundActive, timeLeft]);
    (0, react_1.useEffect)(() => {
        if (gameStarted) {
            saveGameState();
        }
    }, [teams, words, scores]);
    const saveGameState = () => {
        const gameState = {
            teams,
            words,
            scores
        };
        localStorage.setItem('aliasGameState', JSON.stringify(gameState));
    };
    const handleFileUpload = (event) => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                var _a;
                const content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                setWords(content.split('\n').filter(word => word.trim() !== ''));
            };
            reader.readAsText(file);
        }
    };
    const startGame = () => {
        if (words.length > 0 && teams.every(team => team.trim() !== '')) {
            setGameStarted(true);
            startRound();
        }
        else {
            alert('Vă rugăm să încărcați cuvintele și să numiți toate echipele înainte de a începe jocul.');
        }
    };
    const startRound = () => {
        setTimeLeft(60);
        setIsRoundActive(true);
        setRoundScore(0);
        setShowNextRoundButton(false);
        setShowScore(false);
        setLastWordHandled(false);
        nextWord();
    };
    const endRound = () => {
        setIsRoundActive(false);
    };
    const nextWord = () => {
        const availableWords = words.filter(word => !skippedWords.includes(word));
        if (availableWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            setCurrentWord(availableWords[randomIndex].toUpperCase());
        }
        else {
            endGame();
        }
    };
    const handleGuess = () => {
        setScores(prevScores => {
            const newScores = [...prevScores];
            newScores[currentTeam]++;
            return newScores;
        });
        setRoundScore(prevScore => prevScore + 1);
        if (timeLeft > 0) {
            nextWord();
        }
        else {
            setShowScore(true);
            setLastWordHandled(true);
            setShowNextRoundButton(true);
        }
    };
    const handleSkip = () => {
        setSkippedWords(prev => [...prev, currentWord]);
        if (timeLeft > 0) {
            nextWord();
        }
        else {
            setShowScore(true);
            setLastWordHandled(true);
            setShowNextRoundButton(true);
        }
    };
    const nextTeam = () => {
        setCurrentTeam((prevTeam) => (prevTeam + 1) % 3);
        if (words.length > skippedWords.length) {
            startRound();
        }
        else {
            endGame();
        }
    };
    const endGame = () => {
        setGameStarted(false);
        setIsRoundActive(false);
        alert(`Jocul s-a terminat! Scor final:\n${teams.map((team, index) => `${team}: ${scores[index]}`).join('\n')}`);
    };
    const getTimeBarColor = () => {
        const greenValue = Math.floor((timeLeft / 60) * 255);
        const redValue = 255 - greenValue;
        return `rgb(${redValue}, ${greenValue}, 0)`;
    };
    return (<card_1.Card className="w-full max-w-md mx-auto">
      <card_1.CardContent className="pt-6">
        <framer_motion_1.AnimatePresence mode="wait">
          {!gameStarted ? (<framer_motion_1.motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <input_1.Input type="file" accept=".txt" onChange={handleFileUpload} ref={fileInputRef} className="mb-4"/>
              {teams.map((team, index) => (<input_1.Input key={index} value={team} onChange={(e) => setTeams(prev => {
                    const newTeams = [...prev];
                    newTeams[index] = e.target.value;
                    return newTeams;
                })} placeholder={`Numele echipei ${index + 1}`} className="mb-2"/>))}
              <button_1.Button onClick={startGame} className="w-full mt-4">Începe Jocul</button_1.Button>
            </framer_motion_1.motion.div>) : (<framer_motion_1.motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">{teams[currentTeam].toUpperCase()}</h3>
                <framer_motion_1.motion.p key={currentWord} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-bold mt-2">
                  {showScore ? `${teams[currentTeam].toUpperCase()}: ${roundScore} PUNCTE` : currentWord}
                </framer_motion_1.motion.p>
              </div>
              <div className="w-full h-2 mb-4 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e0e0' }}>
                <div className="h-full transition-all duration-1000 ease-linear" style={{
                width: `${(timeLeft / 60) * 100}%`,
                backgroundColor: getTimeBarColor()
            }}/>
              </div>
              {(isRoundActive || (!isRoundActive && !lastWordHandled)) && (<div className="flex justify-between mb-4 gap-4">
                  <button_1.Button onClick={handleGuess} className="flex-1 bg-green-500 hover:bg-green-600">Ghicit</button_1.Button>
                  <button_1.Button onClick={handleSkip} variant="outline" className="flex-1">Omite</button_1.Button>
                </div>)}
              {showNextRoundButton && (<button_1.Button onClick={nextTeam} className="w-full">Următoarea Rundă</button_1.Button>)}
            </framer_motion_1.motion.div>)}
        </framer_motion_1.AnimatePresence>
      </card_1.CardContent>
      <audio ref={audioRef} src="/path-to-your-sound-file.mp3"/>
    </card_1.Card>);
}
