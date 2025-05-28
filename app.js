const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const TOTAL_POKEMON = 1010; // Número total de Pokémon disponíveis

const searchInput = document.getElementById('searchInput');
const contentDiv = document.getElementById('content');

// Event listener para busca com Enter
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});

// Função principal para buscar Pokémon
async function searchPokemon() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        showError('Por favor, digite o nome ou número de um Pokémon');
        return;
    }

    showLoading();

    try {
        const pokemon = await fetchPokemonData(query);
        displayPokemon(pokemon);
    } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
        showError('Pokémon não encontrado. Verifique o nome ou número e tente novamente.');
    }
}

// Função para buscar Pokémon aleatório
async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    searchInput.value = randomId;

    showLoading();

    try {
        const pokemon = await fetchPokemonData(randomId);
        displayPokemon(pokemon);
    } catch (error) {
        console.error('Erro ao buscar Pokémon aleatório:', error);
        showError('Erro ao carregar Pokémon aleatório. Tente novamente.');
    }
}

// Função para fazer requisição à API
async function fetchPokemonData(query) {
    const response = await fetch(`${API_BASE_URL}${query}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

// Função para exibir dados do Pokémon
function displayPokemon(pokemon) {
    const pokemonCard = `
                <div class="pokemon-card">
                    <div class="pokemon-header">
                        <h2 class="pokemon-name">${pokemon.name}</h2>
                        <span class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</span>
                    </div>
                    
                    <div class="pokemon-image">
                        <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                             alt="${pokemon.name}" onerror="this.src='${pokemon.sprites.front_default}'">
                    </div>
                    
                    <div class="pokemon-types">
                        ${pokemon.types.map(type =>
        `<span class="type-badge type-${type.type.name}">${type.type.name}</span>`
    ).join('')}
                    </div>
                    
                    <div class="pokemon-info">
                        <div class="info-item">
                            <div class="info-label">Altura</div>
                            <div class="info-value">${(pokemon.height / 10).toFixed(1)} m</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Peso</div>
                            <div class="info-value">${(pokemon.weight / 10).toFixed(1)} kg</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Experiência Base</div>
                            <div class="info-value">${pokemon.base_experience}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Habilidades</div>
                            <div class="info-value">${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</div>
                        </div>
                    </div>
                    
                    <div class="pokemon-stats">
                        <h3>📊 Estatísticas Base</h3>
                        ${pokemon.stats.map(stat => `
                            <div class="stat-item">
                                <span class="stat-name">${getStatName(stat.stat.name)}</span>
                                <span class="stat-value">${stat.base_stat}</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${Math.min((stat.base_stat / 255) * 100, 100)}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

    contentDiv.innerHTML = pokemonCard;
}

// Função para traduzir nomes das estatísticas
function getStatName(statName) {
    const statNames = {
        'hp': 'HP',
        'attack': 'Ataque',
        'defense': 'Defesa',
        'special-attack': 'Atq. Especial',
        'special-defense': 'Def. Especial',
        'speed': 'Velocidade'
    };
    return statNames[statName] || statName;
}

// Função para exibir loading
function showLoading() {
    contentDiv.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    Carregando Pokémon...
                </div>
            `;
}

// Função para exibir erro
function showError(message) {
    contentDiv.innerHTML = `
                <div class="error">
                    <h3>❌ Oops!</h3>
                    <p>${message}</p>
                </div>
            `;
}

// Carregar um Pokémon aleatório ao iniciar
window.addEventListener('load', function () {
    getRandomPokemon();
});