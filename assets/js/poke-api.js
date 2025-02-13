
const pokeApi = {}

function convertPokeApiToPokemon (pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.image = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}    

pokeApi.getPokemonsDetail = (pokemon) => {
    return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiToPokemon)
}

pokeApi.getPokemons = (offset, limit) =>{
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)

        .catch((error) => console.error(error))
}

pokeApi.getPokemonData = (pokemonName) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`

    return fetch(url)
        .then((response) => response.json())
        .then((pokeDetail) => {
            const pokemonData = {
                height: pokeDetail.height,
                weight: pokeDetail.weight,
                abilities: pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name),
                baseStats: pokeDetail.stats.map((statSlot) => ({
                    stat: statSlot.stat.name,
                    value: statSlot.base_stat
                }))
            }
            return pokemonData
        })
        .catch((error) => console.error(error))
}