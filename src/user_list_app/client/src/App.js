
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Search } from './components/Search';
import { UserList } from './components/UserList';

import './App.css';

function App() {
    
    return (
        <div>
            <Header />
            <main className="main">
                <section className="card users-container">
                    <Search />
                    
                    <UserList/>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default App;
