{ 
    class Pokemon {
        constructor(params) {
            [this.ID, 
			this.Name, 
			this.Type] = params;
        }

        Attack = (attackName) => {
            return `${this.Name} used ${attackName} and it's super effective!`;
        }
    };

	const pokemons = [
	    new Pokemon([ 1, 'Bulbasaur', [ 'Grass', 'Poison' ]]),
		new Pokemon([ 2, 'Ivysaur', [ 'Grass', 'Poison' ]]),
		new Pokemon([ 4, 'Charmander', [ 'Fire' ]]),
		new Pokemon([ 7, 'Squirtle',  [ 'Water' ]]),

	];
	
	const pokemonAttackMatrix = [
		{ id: 1, attack: [ 'Vine Whip', 'Poison Powder' ]}, 
		{ id: 2, attack: [ 'Razor Leaf' ]}, 
		{ id: 4, attack: [ 'FlameThrower' ]}, 
		{ id: 7, attack: [ 'Bubble Beam' ]}, 
	]

	const findWhere = (collection, patternObject = { Type: 'Grass' }) => {
		let itemsFound = collection;
		
		Object.keys(patternObject).forEach((key) => {
			itemsFound = itemsFound.filter((item) => 
			Array.isArray(item[key]) 
				? item[key].filter((subItem) => subItem === patternObject[key]).length > 0
				: item[key] === patternObject[key]);
		});

		return itemsFound;
    }

    console.log(pokemons);

    console.log(`call findWhere() with argument from AC`);
    console.log(findWhere(pokemons, {Type: 'Poison'}));
    
    console.log(`call findWhere(), i.e, object argument with additional properties`);
    console.log(findWhere(pokemons, {Type: 'Grass', ID: 2}));
    
    console.log(`call findWhere() with trailing commas`);
    console.log(findWhere(pokemons, {Type: 'Grass',},));

    console.log(`call findWhere() relying on its default parameter value`);
    console.log(findWhere(pokemons));
	
	
    console.log(`TEST: find all attacks of each pokemon using findWhere() in attack matrix, and use the list in invoking each pokemon's Attack()`);
	pokemons.forEach( pokemon => {
		let attackLists = findWhere(pokemonAttackMatrix, { id: pokemon.ID });
		
		attackLists && attackLists.forEach( attackList => {
			attackList.attack && attackList.attack.forEach( attack => {
			    // console.log(attack);
				console.log(pokemon.Attack(attack)); 
			});
        });
	});
}