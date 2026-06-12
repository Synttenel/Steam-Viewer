import { useState } from 'react'
import './SteamViewer.css'
import { useEffect } from 'react';
import { db } from '../config/firebase';
import { addDoc } from "firebase/firestore";
import {
  collection,
  getDocs
} from "firebase/firestore";
import { doc } from 'firebase/firestore';
const VITE_API_URL = import.meta.env.VITE_API_URL;

function SteamViewer() {

  // Guarda os usuários
  const [users, setUsers] = useState([]);
  // Guarda os dados a serem enviados para a função de fetchSteamData
  const [input, setInput] = useState("");
  // Guarda os dados a serem enviados para a função Filter
  const [filter, setFilter] = useState("");
  // Um switch para controlar animações 
  const [fetchCount, setFetchCount] = useState(0);
  // Guarda informações de cada endpoint
  const [player, setPlayer] = useState(null);
  const [level, setLevel] = useState(null);
  const [games, setGames] = useState(null);
  const [badges, setBadges] = useState(null);
  const [steamAge, setSteamAge] = useState(null);
  const [playTimeAll, setPlayTimeAll] = useState(null);
  const [playTime2Weeks, setPlayTime2Weeks] = useState(null);
  const [friends, setFriends] = useState(null);
  const [groups, setGroups] = useState(null);
  // Guarda os rewards
  const [levelRank, setLevelRank] = useState([]);

  // Função de escrita
  async function saveUser(
   player,
   level,
   games,
   badges,
   steamAge,
   playTimeAll,
   playTime2Weeks,
   friends,
   groups
) {

   try {

      const response = await fetch(
         `${VITE_API_URL}/users`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({

               steamId: player.steamid,

               nickName: player.personaname,

               name: player.realname === undefined
                  ? "Privado!"
                  : player.realname,

               avatar: player.avatarfull === undefined
                  ? "https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"
                  : player.avatarfull,

               url: player.profileurl,

               level: level === undefined
                  ? "Privado!"
                  : level,

               gameCount: games.game_count === undefined
                  ? "Privado!"
                  : games.game_count,

               badgeCount: badges.length === 0
                  ? "Privado!"
                  : badges.length,

               steamAge: steamAge === undefined
                  ? "Privado!"
                  : steamAge,

               playTimeAll: playTimeAll === 0
                  ? "0 Horas ou Privado!"
                  : playTimeAll,

               playTimeTwoWeeks: playTime2Weeks === 0
                  ? "0 Horas ou Privado!"
                  : playTime2Weeks,

               friendCount: friends === undefined
                  ? "Privado!"
                  : friends,

               groupCount: groups === undefined
                  ? "Privado!"
                  : groups

            })
         }
      );

      const data = await response.json();

      //console.log(data);

   } catch(err) {

      console.log(err);

   }

}

  // Função de leitura
   async function getUsers() {

    try {

      
      const querySnapshot = await getDocs(
        collection(db, "users")
      );

      
      const usersArray = [];

      
      querySnapshot.forEach((docItem) => {

        usersArray.push({

          
          id: docItem.id,

          
          ...docItem.data()

        });

      });

      
      setUsers(usersArray);
      //console.log(usersArray);

    } catch(err) {

      console.log(err);

    }

  }

  // Lê os usuários no recarregamento da página
  useEffect(() => {

    getUsers();
    
    //console.log(users);
    
    

  }, []);
  // Loop para emição de pontuação para cada usuário
    for(let i = 0; i < users.length; i++){
      
        let points = 0;
        let pointsCareer = 0;
        let pointsExperience = 0;
        let pointsSocial = 0;
        
        points += (typeof users[i].gameCount===typeof 0?users[i].gameCount: 0) * 0.75;
        pointsCareer += (typeof users[i].gameCount===typeof 0?users[i].gameCount: 0) * 0.75;
        
        points += (typeof users[i].badgeCount===typeof 0?users[i].badgeCount: 0) * 1;
        pointsCareer += (typeof users[i].badgeCount===typeof 0?users[i].badgeCount: 0) * 1;

        points += (typeof users[i].level===typeof 0?users[i].level: 0) * 1;
        pointsCareer += (typeof users[i].level===typeof 0?users[i].level: 0) * 1;
        
        points += (typeof users[i].steamAge===typeof 0?users[i].steamAge: 0) * 1.5;
        pointsExperience += (typeof users[i].steamAge===typeof 0?users[i].steamAge: 0) * 1.5;
        
        points += (typeof users[i].playTimeAll===typeof 0?users[i].playTimeAll: 0) * 0.5;
        pointsExperience += (typeof users[i].playTimeAll===typeof 0?users[i].playTimeAll: 0) * 0.5;
        
        points += (typeof users[i].playTimeTwoWeeks===typeof 0?users[i].playTimeTwoWeeks: 0) * 1.25;
        pointsExperience += (typeof users[i].playTimeTwoWeeks===typeof 0?users[i].playTimeTwoWeeks: 0) * 1.25;
        
        points += (typeof users[i].friendCount===typeof 0?users[i].friendCount: 0) * 1;
        pointsSocial += (typeof users[i].friendCount===typeof 0?users[i].friendCount: 0) * 1;
        
        points += (typeof users[i].groupCount===typeof 0?users[i].groupCount: 0) * 1.25;
        pointsSocial += (typeof users[i].groupCount===typeof 0?users[i].groupCount: 0) * 1.25;
        
        points = Math.floor(points);
        pointsCareer = Math.floor(pointsCareer);
        pointsExperience = Math.floor(pointsExperience);
        pointsSocial = Math.floor(pointsSocial);

        // Sub-divisões de pontos para cada usuário
        users[i]["points"] = points;
        users[i]["pointsCareer"] = pointsCareer;
        users[i]["pointsExperience"] = pointsExperience;
        users[i]["pointsSocial"] = pointsSocial;
        users[i]["awards"] = [];

        // Loop de conquistas
        if(pointsCareer >= 30 && pointsCareer < 50){
          users[i].awards.push("💼Tem uma carreira Steam Boa!");
        }
        else if(pointsCareer > 30 && pointsCareer < 75){
          users[i].awards.push("💼🥉Tem uma carreira Steam Muito Boa!");
        }
        else if(pointsCareer > 75 && pointsCareer < 100){
          users[i].awards.push("💼🥈Tem uma carreira Steam Excepcional!");
        }
        else if(pointsCareer >= 100){
          users[i].awards.push("💼🥇Tem uma carreira Steam Extraordinária!");
        }
        else if(pointsCareer < 30){
          users[i].awards.push("Tem uma carreira modesta na Steam.");
        }

        if(pointsExperience >= 500 && pointsExperience < 1000){
          users[i].awards.push("⏳É Bem experienciado na Steam!");
        }
        else if(pointsExperience > 1000 && pointsExperience < 1500){
          users[i].awards.push("⏳🥉É Muito experienciado na Steam!");
        }
        else if(pointsExperience > 1500 && pointsExperience < 2500){
          users[i].awards.push("⏳🥈É Incrivelmente experienciado na Steam!");
        }
        else if(pointsExperience >= 2500){
          users[i].awards.push("⏳🥇É Extraordinariamente experienciado na Steam!");
        }
        else if(pointsExperience < 500){
          users[i].awards.push("Gosta de ser casual na Steam.");
        }

        if(pointsSocial >= 20 && pointsSocial < 50){
          users[i].awards.push("🗣É Bem social na Steam!");
        }
        else if(pointsSocial > 50 && pointsSocial < 75){
          users[i].awards.push("🗣🥉É Muito social na Steam!");
        }
        else if(pointsSocial > 75 && pointsSocial < 120){
          users[i].awards.push("🗣🥈É Excepcionalmente social na Steam!");
        }
        else if(pointsSocial >= 120){
          users[i].awards.push("🗣🥇É Extraordinariamente social na Steam!");
        }
        else if(pointsSocial < 20){
          users[i].awards.push("Gosta da comunidade da Steam.");
        }
        
        
    }
    // Organizar a visualização dos usuários de forma decrescente de pontos
    users.sort((a,b) => b.points - a.points);

    // Função de endpoint profile
  async function searchProfile(steamId) {
    
    const response = await fetch(
      `${VITE_API_URL}/profile/${steamId}`
    );

    const data = await response.json();

    const player = data.response.players[0];
    
    setPlayer(player);
    // Calcular a quantidade anos do profile
    const steamAge = Math.floor((Date.now() - data.response.players[0].timecreated * 1000) /(1000 * 60 * 60 * 24 * 365.25));
    setSteamAge(steamAge);

  }

    // Função de endpoint Level
    async function searchLevel(steamId) {

    const response = await fetch(
      `${VITE_API_URL}/level/${steamId}`
    );

    const data = await response.json();

    const level = data.response.player_level;
    

    setLevel(level);

    
  }

  // Função de endpoint de games
  async function searchGames(steamId) {

    const response = await fetch(
      `${VITE_API_URL}/games/${steamId}`
    );

    const data = await response.json();

    const games = data.response;
    // Calcular a quantidade de horas jogadas profile
    let playTimeAll = 0;
    let playTime2Weeks = 0;
    //console.log(games, games.games);
    if(!games){
      setGames("Privado!");
      setPlayTimeAll("Privado");
      setPlayTime2Weeks("Privado");
      return;
    }
    if(!games.games){
      setGames("Privado!");
      setPlayTimeAll("Privado");
      setPlayTime2Weeks("Privado");
      return;
    }
    for(let i = 0; i < games.games.length; i++){
        
        if(games.games[i].playtime_2weeks !== undefined){
          playTime2Weeks += games.games[i].playtime_2weeks;
        }
        playTimeAll += games.games[i].playtime_forever;
    }
    
      
    
    playTimeAll = Math.floor(playTimeAll / 60);
    playTime2Weeks = Math.floor(playTime2Weeks / 60);
    
    setGames(games);
    setPlayTimeAll(playTimeAll);
    setPlayTime2Weeks(playTime2Weeks);
    

    
  }

  // Função de endpoint badges
  async function searchBadges(steamId) {

    const response = await fetch(
      `${VITE_API_URL}/badges/${steamId}`
    );

    const data = await response.json();

    const badges = data.response.badges;
    
    setBadges(badges);

    

    
  }

  // Função de endpoint de friends
  async function searchFriends(steamId) {

    const response = await fetch(
      `${VITE_API_URL}/friends/${steamId}`
    );
    const data = await response.json();
    let friends = "Privado!"
    if(data.friendslist === undefined){
      setFriends(friends);
      return;
    }
    else{
      friends = data.friendslist.friends.length;
    }
    
    
    setFriends(friends);

    

    
  }

  // Função de endpoint groups
  async function searchGroups(steamId) {

    const response = await fetch(
      `${VITE_API_URL}/groups/${steamId}`
    );

    const data = await response.json();
    const groups = data.response.groups.length;
    
    
    setGroups(groups);

    

    
  }
  // Função para atualizar o useState input
  function getInput(e){
    setInput(e.target.value);
    //console.log(e.target.value);
    //console.log(input);

  }

  // Função ponte para a escrita e backend
  async function fetchSteamData(e){
      
      const reload = document.getElementsByClassName("card-button");
      //console.log(e.target.style);
      e.target.disabled = true;
      e.target.style.cursor = "not-allowed";
      for(let i = 0; i < reload.length; i++){
        reload[i].disabled = "true";
        reload[i].style.cursor = "not-allowed";
      }
      //console.log(input);
      setTimeout(() => {
        e.target.style.marginRight = "20px";
        e.target.style.marginLeft = "20px";
        e.target.style.paddingRight = "20px";
        e.target.style.paddingLeft = "20px";
      }, 100);
      console.log("fetching...");
      setTimeout(() => {
        for(let i = 0; i < reload.length; i++){
          reload[i].disabled = false;
          reload[i].style.cursor = "pointer";
        }
        e.target.innerText = "Enviar";
        e.target.style.cursor = "pointer";
        e.target.style.paddingRight = "5px";
        e.target.style.paddingLeft = "5px";
        e.target.style.marginRight = "0px";
        e.target.style.marginLeft = "0px";
        e.target.style.backgroundColor = "#a3c702";
        e.target.disabled = false;
      }, 3000);
      setTimeout(() => {
        e.target.innerText = "0%";
        e.target.style.backgroundColor = "#c70202";
      }, 100);
      //console.log(e.target.value);
      //console.log(e.target);
      await searchProfile(input);
      setTimeout(() => {
        e.target.innerText = "25%";
        e.target.style.backgroundColor = "#c77202";
      }, 100);
      await searchLevel(input);
      setTimeout(() => {
        e.target.innerText = "50%";
        e.target.style.backgroundColor = "#c4c702";
      }, 100);
      await searchGames(input);
      setTimeout(() => {
        e.target.innerText = "75%";
        e.target.style.backgroundColor = "#b3c702";
      }, 100);
      await searchBadges(input);
      setTimeout(() => {
        e.target.innerText = "99%";
        e.target.style.backgroundColor = "#82c702";
      }, 100);
      await searchFriends(input);
      await searchGroups(input);
      setTimeout(() => {
        e.target.innerText = "100%";
        e.target.style.backgroundColor = "#29c702";
      }, 100);
      setTimeout(() => {
        e.target.innerText = "Enviado!";
        e.target.style.backgroundColor = "#02c7bd";
        
      }, 100);

      setFetchCount(fetchCount+1);
      console.log("fetched!");
      
    }

    // Função de recarregar dados da leitura
    async function reloadSteamData(steamId){

      const status = document.getElementById("searchSubmit");
      const reload = document.getElementsByClassName("card-button");
      //console.log(reload);
      for(let i = 0; i < reload.length; i++){
        reload[i].disabled = "true";
        reload[i].style.cursor = "not-allowed";
      }
      status.disabled = true;
      status.style.cursor = "not-allowed";
      
      //console.log(steamId);
      setTimeout(() => {
        status.style.marginRight = "20px";
        status.style.marginLeft = "20px";
        status.style.paddingRight = "20px";
        status.style.paddingLeft = "20px";
      }, 100);
      console.log("reloading...");
      setTimeout(() => {
        for(let i = 0; i < reload.length; i++){
          reload[i].disabled = false;
          reload[i].style.cursor = "pointer";
        }
        status.innerText = "Enviar";
        status.style.cursor = "pointer";
        status.style.paddingRight = "5px";
        status.style.paddingLeft = "5px";
        status.style.marginRight = "0px";
        status.style.marginLeft = "0px";
        status.style.backgroundColor = "#a3c702";
        status.disabled = false;
      }, 3000);
      setTimeout(() => {
        status.innerText = "0%";
        status.style.backgroundColor = "#c70202";
      }, 100);
      
      await searchProfile(steamId);
      setTimeout(() => {
        status.innerText = "25%";
        status.style.backgroundColor = "#c77202";
      }, 100);
      await searchLevel(steamId);
      setTimeout(() => {
        status.innerText = "50%";
        status.style.backgroundColor = "#c4c702";
      }, 100);
      await searchGames(steamId);
      setTimeout(() => {
        status.innerText = "75%";
        status.style.backgroundColor = "#b3c702";
      }, 100);
      await searchBadges(steamId);
      setTimeout(() => {
        status.innerText = "99%";
        status.style.backgroundColor = "#82c702";
      }, 100);
      await searchFriends(steamId);
      await searchGroups(steamId);
      setTimeout(() => {
        status.innerText = "100%";
        status.style.backgroundColor = "#29c702";
      }, 100);
      setTimeout(() => {
        status.innerText = "Recarregado!";
        status.style.backgroundColor = "#02c7bd";
        
      }, 100);

      setFetchCount(fetchCount+1);
      console.log("reloaded!");
    }

    // useEffect que só irá engatilhar quando fetchCount alterar de valor,
    // quando a ponte já for criada
    useEffect(() => {

        
        saveUser(player, level, games, badges, steamAge, playTimeAll, playTime2Weeks, friends, groups);
        setTimeout(() => {
          getUsers();
        }, 100);
        const cards = document.getElementsByClassName("card");
        setTimeout(() => {
          //console.log(cards);
          for(let i = 0; i < cards.length; i++){
            cards[i].style.boxShadow = "0px 0px 25px #66c0f4";
          }
        }, 100);
        setTimeout(() => {
          //console.log(cards);
          for(let i = 0; i < cards.length; i++){
            cards[i].style.boxShadow = "0px 0px 0px white";
          }
        }, 1000);

      },[fetchCount]);

  // Função de filtragem/destacamento
  function handleFilter(e){
    
    const card = document.getElementById(`card${e.target.value.trim()}`);
    //console.log(card);
    const cards = document.getElementsByClassName("card");
    if(!card){
      for(let i = 0; i < cards.length; i++){
      cards[i].style.boxShadow = "0px 0px 0px white";
    }
      return;
    }
    card.style.boxShadow = "0px 0px 35px gold";
  }

  // Função para abrir overlay de informações
  function handleOpenInfo(e){
    const infoContainer = document.getElementById(`${e.target.id}Container`);
    
    infoContainer.style.display = "flex";
    infoContainer.style.opacity =  100;
  }

  // Função para fechar overlay de informações
  function handleCloseInfo(e){
    const infoContainer = document.getElementById(`${e.target.id}Container`);
    
    infoContainer.style.opacity =  0;
    infoContainer.style.display = "none";
  }

  
  return (
    <>
        <div className='top'>
          <div className='top-header'>SteamViewer</div>
          <div className='top-subheader'>Veja suas estátisticas da Steam e compita com outros!</div>
        </div>
        <div className='search-container'>
            
            <input type='text' id='searchInput' className='search-input' placeholder='🔎︎Digite o SteamID64...' maxLength={17} onChange={(e)=>getInput(e)}/>
            <button className='search-submit' id='searchSubmit' onClick={(e)=>fetchSteamData(e)}>Enviar</button>
            <input type='text' id='filterInput' className='search-input' placeholder='🔎︎Destacar por Nickname...' onChange={(e) => handleFilter(e)}/>
            <a className='search-tip' href='https://steamid.io/' target='_blank'>Não sabe o SteamID?</a>
            
            
            
        </div>
        <div className='card-container'>
          {users.map((user, index) =>(
            <div className='card' id={`card${user.nickName}`} key={user.id}>
              <div className='card-info-container' id={`info${user.nickName}Container`}>
                  <button className='card-info-button' id={`info${user.nickName}`} onClick={(e) => handleCloseInfo(e)}>
                  <img id={`info${user.nickName}`} src='https://img.icons8.com/?size=35&id=46&format=png&color=000000'/>
                  </button>
              <div className='card-info-card' >
                <div className='card-header'>{user.name}</div>
              </div>
              <hr style={{width: "50%"}}></hr>
              <div className='card-info-card' >
                <div className='card-header card-header-career'>Carreira</div>
                <div className='card-rewards card-rewards-career'>
                  <ul className='card-list'>
                    <li className='card-list-item'>Número de jogos🎮:</li>
                    <div className='card-info-value'>{user.gameCount}</div>
                    <li className='card-list-item'>Número de insígnias🏅:</li>
                    <div className='card-info-value'>{user.badgeCount}</div>
                    <li className='card-list-item'>Nível de jogador🏅:</li>
                    <div className='card-info-value'>{user.level}</div>
                    <li className='card-list-item'>Número de pontos na seção:</li>
                    <div className='card-info-value'>{user.pointsCareer}</div>
                </ul>
                </div>
              </div>
              <div className='card-info-card' >
                <div className='card-header card-header-experience'>Experiência</div>
                <div className='card-rewards card-rewards-experience'>
                  <ul className='card-list'>
                    <li className='card-list-item'>Idade Steam em anos📆:</li>
                    <div className='card-info-value'>{user.steamAge}</div>
                    <li className='card-list-item'>Número total de horas jogadas🕰️:</li>
                    <div className='card-info-value'>{user.playTimeAll}</div>
                    <li className='card-list-item'>Número de horas nas últimas duas semanas🔥:</li>
                    <div className='card-info-value'>{user.playTimeTwoWeeks}</div>
                    <li className='card-list-item'>Número de pontos na seção:</li>
                    <div className='card-info-value'>{user.pointsExperience}</div>
                </ul>
                </div>
              </div>
              <div className='card-info-card' >
                <div className='card-header card-header-social'>Social</div>
                <div className='card-rewards card-rewards-social'>
                  <ul className='card-list'>
                    <li className='card-list-item'>Número de amigos🤝:</li>
                    <div className='card-info-value'>{user.friendCount}</div>
                    <li className='card-list-item'>Número grupos👥👥:</li>
                    <div className='card-info-value'>{user.groupCount}</div>
                    <li className='card-list-item'>Número de pontos na seção:</li>
                    <div className='card-info-value'>{user.pointsSocial}</div>
                </ul>
                </div>
              </div>
              <div className='card-info-card' >
                <div className='card-header card-header-points'>Total de Pontos</div>
                <div className='card-rewards card-rewards-points'>
                  <ul className='card-list'>
                    <div className='card-info-value'>{user.points}</div>
                </ul>
                </div>
              </div>
            </div>
              <div className={`card-rank card-rank-${index+1}`} id={`${user.name}rank`}>{`${index+1}°`}</div>
              <div className='card-header'>{user.nickName}</div>
              <img className='card-image' src={user.avatar}/>
              <div className='card-level'>{`Nvl: ${user.level}`}</div>
              <div className='card-rewards'>
              <ul className='card-list'>
                
              {user.awards.map((award, index) => (
                <li className='card-list-item' key={index}>{award}</li>
              ))}
                
                
              </ul>
            </div>
            <div className='card-button-container'>
              <div className='card-button-card' id={`info${user.nickName}`}>
              <button className='card-button' id={`info${user.nickName}`} 
              onClick={(e) => handleOpenInfo(e)}>
                <img id={`info${user.nickName}`} src='https://img.icons8.com/?size=35&id=77&format=png&color=000000'/>
              </button>
              <div className='card-button-tooltip'>Ver mais</div>
              </div>
              <div className='card-button-card'>
              <button className='card-button'>
                <a href={user.url} target='_blank'>
                <img src='https://img.icons8.com/?size=35&id=ZjsLJhlQchzI&format=png&color=000000'/>
                </a>
              </button>
              <div className='card-button-tooltip'>Perfil</div>
              </div>
              <div className='card-button-card'>
              <button className='card-button' onClick={() => reloadSteamData(user.steamId)}>
                <img src='https://img.icons8.com/?size=35&id=12494&format=png&color=000000'/>
              </button>
              <div className='card-button-tooltip'>Recarregar</div>
              </div>
            </div>
            <div className='card-button-container'>
              <div className='card-button-tooltip-mobile'>Ver mais</div>
              <div className='card-button-tooltip-mobile'>Perfil</div>
              <div className='card-button-tooltip-mobile'>Recarregar</div>
            </div>
            </div>
          ))}
        </div>
        <div className='footer'>
          <div className='footer-item'>Feito com ❤ por Guilherme Severo</div>
          <div className='footer-item'>Este site não é associado à Valve Corp.</div>
          <div className='footer-item'>Ícones utilizados do site icons8.com.br</div>
        </div>
    </>
  )
}

export default SteamViewer
