import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { PrivateRoute } from './components/common/PrivateRoute';

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
import { GameOwner } from './components/common/GameOwner';

function App() {

    return (
        <AuthProvider>
            <div id="box">
                <Header />

                {/* Main Content */}
                <GameProvider>
                    <main id="main-content">
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/create' element={(
                                <PrivateRoute>
                                    <CreateGame />
                                </PrivateRoute>
                            )} />
                            <Route element={<GameOwner />}>
                                <Route path='/games/:gameId/edit' element={<EditGame />} />
                            </Route>
                            <Route element={<PrivateRoute />}>
                                <Route path='/logout' element={<Logout />} />
                            </Route>
                            <Route path='/catalog' element={<Catalog />} />
                            <Route path='/catalog/:gameId' element={<GameDetails />} />
                        </Routes>
                    </main>
                </GameProvider>
            </div>
        </AuthProvider>
    );
}

export default App;
