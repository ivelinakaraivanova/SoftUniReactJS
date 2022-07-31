import { CatalogItem } from "./catalog-item/CatalogItem";

export const Catalog = ({games}) => {
    return (
        <section id="catalog-page">
            <h1>All Games</h1>

            {games.length > 0
                    ? games.map(game => <CatalogItem key={game._id} game={game} />)
                    : <h3 className="no-articles">No articles yet</h3>
                }
        </section>
    );
}