import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as gameService from './services/gameService';
import uniqid from 'uniqid';

import { Header } from './components/header/Header';
import { Home } from './components/home/Home';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import { CreateGame } from './components/create-game/CreateGame';
import { Catalog } from './components/catalog/Catalog';
import { GameDetails } from './components/game-details/GameDetails';

import './App.css';

function App() {
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    const addComment = (gameId, comment) => {
        setGames(state => {
            const game = state.find(g => g._id === gameId);
            const comments = game.comments || [];
            comments.push(comment);

            return [
                ...state.filter(g => g._id !== gameId),
                { ...game, comments },
            ]
        });
    };

    const addGameHandler = (gameData) => {
        setGames(state => [
            ...state,
            {
                ...gameData,
                _id: uniqid(),
            }
        ]);

        navigate('/catalog');
    };

    useEffect(() => {
        gameService.getAll()
            .then(result => {
                setGames(result);
            });
    }, []);

    return (
        <div id="box">
            <Header />

            {/* Main Content */}
            <main id="main-content">
                <Routes>
                    <Route path='/' element={<Home games={games} />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/create' element={<CreateGame addGameHandler={addGameHandler} />} />
                    <Route path='/catalog' element={<Catalog games={games} />} />
                    <Route path='/catalog/:gameId' element={<GameDetails games={games} addComment={addComment} />} />
                </Routes>
            </main>

        </div>

    );
}

export default App;
