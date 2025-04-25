import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TextInput } from 'react-native';
import Filtro from './filtro';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

export default function Lista() {
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        if (tipoSeleccionado === 'All') {
          const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
          const json = await res.json();
          setData(json.results);
        } else {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${tipoSeleccionado}`);
          const json = await res.json();
          const listaFiltrada = json.pokemon.map(p => p.pokemon);
          setData(listaFiltrada);
        }
      } catch (error) {
        console.error('Error al cargar pokemones', error);
      }
    };
    obtenerDatos();
  }, [tipoSeleccionado]);

  let resultados = data;
  if (busqueda.length >= 3 && isNaN(busqueda)) {
    resultados = data.filter(pokemon =>
      pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  } else if (!isNaN(busqueda) && busqueda !== '') {
    resultados = data.filter(pokemon =>
      pokemon.url.includes('/' + busqueda)
    );
  }

  return (
    <ScrollView>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar Pokémon"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <Filtro onTipoChange={setTipoSeleccionado} />

      <View style={styles.lista}>
        {resultados.map((pokemon, index) => {
          const nombre = pokemon.name;
          const id = pokemon.url?.split('/')[6];

          return (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => navigation.navigate('Pokemon', { nombre })}
            >
              <Text>{id}</Text>
              <Image
                source={{
                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                }}
                style={styles.imagen}
              />
              <Text>{nombre}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buscador: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    padding: 10,
  },
  item: {
    backgroundColor: 'aliceblue',
    width: '48%',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
