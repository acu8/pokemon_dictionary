import { useEffect, useState, useRef } from 'react';
import './App.css';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';
import { getAllPokemon, getPokemon } from './utils/pokemon.js';

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef();

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      //各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      // console.log(res.next);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
      
    }
    fetchPokemonData();
  }, [])
  
  const loadPokemon = async(data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        // console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  }

  // console.log(pokemonData);

  //次ページを表示
  const handleNextPage = async() => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    // console.log(data);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  //前ページを表示
  const handlePrevPage = async() => {
    //nullの場合(最初のページ)
    if(!prevURL) return;

    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);

  };

  return (
    <>
    <Navbar />
    {/* 検索ボックス */}
    <div className='doSearch'>
    <input className='searchBox' 
    type="text" ref={ref} 
    onChange={() => setSearchQuery(ref.current.value)} 
    placeholder='Search'
    />
    </div>
    <div className="App">
      {loading ? (<h1>ロード中</h1>):(
      <>
        <div className='pokemonCardContainer'>
        
        {/* フィルタリングで検索機能を作成 */}
        {/* データが1ページずつしか取れてきていないので、今後の課題 */}
          {pokemonData.filter((pokemonData) => {
            return searchQuery === '' 
            ? <Card /> 
            : pokemonData.name.toLowerCase().includes(ref.current.value);
          })
          .map((pokemon,i) => {
            return <Card key={i} pokemon={pokemon} />
          })}
          
     
          
        </div>
        <div className='btn'>
          <button onClick={handlePrevPage}>前へ</button>
          <button onClick={handleNextPage}>次へ</button>
        </div>
      </>
      )}
    </div>
    </>
  );
}

export default App;
