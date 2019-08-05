{ 
	const pokemons = [
		{id: 1, name: 'Bulbasaur', type: 'Grass'},
		{id: 2, name: 'Ivysaur', type: 'Grass'},
		{id: 4, name: 'Charmander', type: 'Fire'},
		{id: 7, name: 'Squirtle',  type: 'Water'},

	];

	const findWhere = (collection, patternObject = { type: 'Grass' }) => {
		let itemsFound = collection;
		
		Object.keys(patternObject).forEach((key) => {
			itemsFound = itemsFound.filter((item) => item[key] === patternObject[key]);
		});

		return itemsFound;
    }

    console.log(`call findWhere() with argument from AC`);
    console.log(findWhere(pokemons, {type: 'Grass'}));
    
    console.log(`call findWhere(), i.e, object argument with additional properties`);
    console.log(findWhere(pokemons, {type: 'Grass', id: 2}));
    
    console.log(`call findWhere() with trailing commas`);
    console.log(findWhere(pokemons, {type: 'Grass',},));

    console.log(`call findWhere() relying on its default parameter value`);
    console.log(findWhere(pokemons));
}