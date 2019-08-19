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
	    new Pokemon([ 1, 'Bulbasaur', [ 'Grass' ]]),
	    new Pokemon([ 1, 'Bulbasaur', [ 'Poison' ]]),
		new Pokemon([ 2, 'Ivysaur', [ 'Grass' ]]),
		new Pokemon([ 2, 'Ivysaur', [ 'Poison' ]]),
		new Pokemon([ 4, 'Charmander', [ 'Fire' ]]),
		new Pokemon([ 7, 'Squirtle',  [ 'Water' ]]),

	];

    console.log(`Initial array value: `);
    console.log(pokemons);
    
    const pluck = (arrayObject, property, isUniqueValuesOnly = false, isThrowIfPropertyNotFound = false) => {

        if (!Array.isArray(arrayObject)) {
            throw new Error(`Invalid argument for expected array parameter.`);
        }

        if (!arrayObject.some((item) => item[property])) {
            if (isThrowIfPropertyNotFound) {
                throw new Error(`Objects in array do not contain the expected '${property}' property.`)
            } else {
                return [];
            }
        }

        const allProps = arrayObject.map((item) => item[property]);

        if(!isUniqueValuesOnly) return allProps;

        return Array.from(new Set(allProps));
    };
    
    console.log(`Case 1.1) call pluck() with valid arguments \n=> pluck(pokemons, 'Name')`);
    console.log(pluck(pokemons, 'Name'));
    
    console.log(`Case 1.2) call pluck() with valid arguments and configure to return unique values only \n=> (pokemons, 'Name', true)`);
    console.log(pluck(pokemons, 'Name', true));

    try {
        console.log(`Case 2.1) call pluck() with invalid argument, i.e., non-array argument vs. array parameter \n=> pluck('pokemon', 'Name')`);
        console.log(pluck('pokemon', 'Name'));
    } catch(e) {
        console.log(`ERROR: ${e.message}`);
    }

    try {
        console.log(`Case 2.2) call pluck() with invalid arguments, i.e., non-existent property but configured to not throw error on such \n=> pluck(pokemons, 'name')`);
        console.log(pluck(pokemons, 'name'));
    } catch(e) {
        console.log(`ERROR: ${e.message}`);
    }

    try {
        console.log(`Case 2.3) call pluck() with invalid arguments, i.e., configure to throw error on non-existent property \n=> pluck(pokemons, 'name', null, true)`);
        console.log(pluck(pokemons, 'name', null, true));
    } catch(e) {
        console.log(`ERROR: ${e.message}`);
    }
}

