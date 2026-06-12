const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const db = require("./firebase");

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://synttenel.github.io"
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Muitas requisições. Tente novamente em alguns minutos."
  }
});

app.use(limiter);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});
// fetch users
app.post("/users", async (req, res) => {

   try {

      const user = req.body;

      await db
         .collection("users")
         .doc(user.steamId)
         .set(user);

      res.status(200).json({
         success: true,
         message: "Usuário salvo"
      });

   } catch(err) {

      console.error(err);

      res.status(500).json({
         success: false,
         error: err.message
      });

   }

});

// Steam profile
app.get("/profile/:steamId", async (req, res) => {

    try {

        const steamId = req.params.steamId;

        if (!/^\d{17}$/.test(steamId)) {

         return res.status(400).json({
            error: "SteamID inválido"
         });

        }

        const response = await axios.get(
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamids: steamId
                }
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Erro ao buscar perfil"
        });

    }

});
//steam level
app.get("/level/:steamId", async (req, res) => {

    try {

        const steamId = req.params.steamId;
        
        if (!/^\d{17}$/.test(steamId)) {

         return res.status(400).json({
            error: "SteamID inválido"
         });

        }

        const response = await axios.get(
            "https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: steamId
                }
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Erro ao buscar perfil"
        });

    }

});
//owned games information
app.get("/games/:steamId", async (req, res) => {

    try {

        const steamId = req.params.steamId;

        if (!/^\d{17}$/.test(steamId)) {

         return res.status(400).json({
            error: "SteamID inválido"
         });

        }

        const response = await axios.get(
            "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: steamId,
                    include_played_free_games: false
                }
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Erro ao buscar perfil"
        });

    }

});
//Badges information
app.get("/badges/:steamId", async (req, res) => {

    try {

        const steamId = req.params.steamId;

        if (!/^\d{17}$/.test(steamId)) {

         return res.status(400).json({
            error: "SteamID inválido"
         });

        }

        const response = await axios.get(
            "https://api.steampowered.com/IPlayerService/GetBadges/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: steamId
                    
                }
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Erro ao buscar perfil"
        });

    }

});
//Friends information
app.get("/friends/:steamId", async (req, res) => {

    try {

        const steamId = req.params.steamId;

        if (!/^\d{17}$/.test(steamId)) {

         return res.status(400).json({
            error: "SteamID inválido"
         });

        }

        const response = await axios.get(
            "https://api.steampowered.com/ISteamUser/GetFriendList/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: steamId,
                    relationship: "friend"
                    
                }
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Erro ao buscar perfil"
        });

    }

});
//Groups information
app.get("/groups/:steamId", async (req, res) => {

    try {

        const steamId = req.params.steamId;

        if (!/^\d{17}$/.test(steamId)) {

         return res.status(400).json({
            error: "SteamID inválido"
         });

        }

        const response = await axios.get(
            "https://api.steampowered.com/ISteamUser/GetUserGroupList/v1/",
            {
                params: {
                    key: process.env.STEAM_API_KEY,
                    steamid: steamId
                    
                    
                }
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Erro ao buscar perfil"
        });

    }

});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});