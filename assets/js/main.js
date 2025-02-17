const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const pokemonImage = document.getElementById("pokemonImage");
const fade = document.getElementById("fade");

const limit = 12;
let offset = 0;
const maxRecord = 151;

function loadPokemons(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                                
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>                        
                    <img src="${pokemon.image}" alt="${pokemon.name}">
                </div>
            </li>
        `).join('');

    pokemonList.innerHTML += newHtml;

    document.querySelectorAll(".pokemon").forEach((pokemonElement) => {
        pokemonElement.addEventListener("click", () => {
            const pokemonNumber = pokemonElement.getAttribute("data-number");
            const selectedPokemon = pokemons.find(p => p.number == pokemonNumber);
            
            if (selectedPokemon) {
                openModal(selectedPokemon);
            }
            });
        });
    });
}

loadPokemons(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdNextPage = offset + limit;
    if (qtdNextPage >= maxRecord) {
        const newLimit = maxRecord - offset;
        loadPokemons(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemons(offset, limit);
    }
});

const openModal = (pokemon) => {
    modalTitle.textContent = pokemon.name;
    pokemonImage.src = pokemon.image;
    pokemonImage.alt = pokemon.name;


    

    pokeApi.getPokemonData(pokemon.name).then((pokemonData) => {
        const pokemonDetails = `
            <li><span class="modalTitleDetails">Height:</span>  ${pokemonData.height}</li>
            <li><span class="modalTitleDetails">Weight:</span> ${pokemonData.weight}</li>
            <li><span class="modalTitleDetails">Abilities:</span> ${pokemonData.abilities.join(", ")}</li>
        `;
    
        const baseStatsDetails = `
            ${pokemonData.baseStats
                .map((stat) => `<li><span class="modalTitleDetails">${stat.stat}:</span> ${stat.value}</li>`)
                .join("")}
        `;
    
        document.getElementById("pokemonDetails").innerHTML = pokemonDetails;
        document.getElementById("baseStats").innerHTML = baseStatsDetails;
    });
    

    modal.classList.remove("hide");
    fade.classList.remove("hide");
};

const closeModal = () => {
    modal.classList.add("hide");
    fade.classList.add("hide");
};

document.querySelector(".close").addEventListener("click", closeModal);
fade.addEventListener("click", closeModal);
