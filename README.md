# The Pokémon Cycling Game

Single-player, side-scrolling game for adventure, cycling, and pokémon enthusiasts alike. Players take the role of a biker, who must avoid oncoming prehistoric pokémon to complete the longest bike ride possible.

This game is hosted with Firebase. Domain name services are provided by Namecheap. You can play the game at: https://www.pokecycle.com/

(This game is not endorsed by or affiliated with Nintendo or The Pokémon Company.)


## Description

This game was written in JavaScript. It makes modest use of HTML and CSS as well.

The game engine relies on one custom JavaScript function: draw. This function:
- Causes the background image to scroll infinitely
- Draws new, oncoming Pokémon, with the following probabilities: 32.5% (Kabuto, Omanyte), 15% chance (Kabutops, Omastar), 5% (Aerodactyl). The pokémon's x-position on the canvas is automatically assigned based on whether or not it is a flying type (e.g. Aerodactyl)
- Allows the biker to jump and descend
- Maintains the game timer (bottom left corner) based on real UTC time
- Reloads the screen (i.e. game over) if a collision occurs between biker and Pokémon

## Future Development

This game can be much better. Known improvement opportunities include:

Features:
- Choose your character
- Mute background music
- Game-over pop-up window
- Save scores to all-time leaderboard

Bugs:
- Add event listener that pauses the timer if the player navigates to a different active browser tab. Currently, the game will pause when this occurs. However, the game timer will continue to update. This bug allows players to register artificially high scores
- Make game engine responsive to the frames-per-second supported by a player's device. This causes an uneven cross-device gaming experience. For instance, my external monitor renders much slower than my native laptop screen


## Authors and Acknowledgements

Mike Koscinski created this game in June 2020. It was his first programming project. Other sources include:

Images:
- Pokémon sprites: https://pokemondb.net/sprites
- Background images: opening cut scenes of Pokémon Emerald (2005)
- Biker images: https://giphy.com/gifs/pokemon-emerald-LJGpExgmRpUbK

Guidance:
- This game was inspired by a Code Explained JavaScript tutorial (https://www.youtube.com/watch?v=L07i4g-zhDA). This tutorial walks viewers through the creation of a Flappy Bird (2013) clone


## Project Status

This game is still in active development. It is live and available for play at: https://www.pokecycle.com/


## Easter Eggs

This game was inspired by Flappy Bird (2013) and the "Attack of the Prehistoric Pokémon" episode from the Pokémon anime (S1E46).

This game could only take place at the North or South Pole. The sun's reflection persistently appears in the ocean background. This could only happen if the biker were cycling in a circle at the North or South Pole. 