import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { AuthContext } from './context/AuthContext';
import { GameContext } from './context/GameContext';
import * as gameService from './services/gameService';
import { useLocalStorage } from './hooks/useLocalStorage';

import { Header } from './components/header/Header';
import { Home } from './components/home/Home';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import { Logout } from './components/logout/Logout';
import { CreateGame } from './components/create-game/CreateGame';
import { EditGame } from './components/edit-game/EditGame';
import { Catalog } from './components/catalog/Catalog';
import { GameDetails } from './components/game-details/GameDetails';

import './App.css';

function App() {
    const [games, setGames] = useState([]);
    const [auth, setAuth] = useLocalStorage('auth', {});
    const navigate = useNavigate();

    const userLogin = (authData) => {
        setAuth(authData);
    }

    const userLogout = () => {
        setAuth({});
    }

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

    const gameAdd = (gameData) => {
        setGames(state => [
            ...state,
            gameData,
        ]);

        navigate('/catalog');
    };

    const gameEdit = (gameId, gameData) => {
        setGames(state => state.map(g => g._id === gameId ? gameData : g));
    }

    useEffect(() => {
        gameService.getAll()
            .then(result => {
                setGames(result);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user: auth, userLogin, userLogout }}>
            <div id="box">
                <Header />

                {/* Main Content */}
                <GameContext.Provider value={{ games, gameAdd, gameEdit }}>
                    <main id="main-content">
                        <Routes>
                            <Route path='/' element={<Home games={games} />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/logout' element={<Logout />} />
                            <Route path='/create' element={<CreateGame addGameHandler={gameAdd} />} />
                            <Route path='/games/:gameId/edit' element={<EditGame />} />
                            <Route path='/catalog' element={<Catalog games={games} />} />
                            <Route path='/catalog/:gameId' element={<GameDetails games={games} addComment={addComment} />} />
                        </Routes>
                    </main>
                </GameContext.Provider>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
