# The Pokémon Cycling Game

The Pokémon Cycling Game is a side-scrolling single-player game for adventure, cycling, and Pokémon enthusiasts alike. Players take the role of a biker, who must navigate through an onslaught of prehistoric Pokémon to complete the longest bike ride possible. 

(Note: This game is in no way endorsed by, nor affiliated with Nintendo or The Pokémon Company.)


## Description

This game was predominantly written in JavaScript. It makes modest use of HTML and CSS as well. 

The game engine relies entirely on one function: draw. The draw function accomplishes the following:
- Causes the background image to scroll infinitely toward the left, to create the impression of movement
- Randomly draws new, oncoming Pokémon, based on the following probabilities: 32.5% chance (Kabuto, Omanyte), 15% chance (Kabutops, Omastar), 5% chance (Aerodactyl). The height of the Pokémon on the game canvas is automatically assigned based on the Pokémon type (walking vs. flying)
- Allows the biker to jump and descend
- Maintains the game timer (bottom left corner) based on real UTC time
- Reloads the screen (i.e. game over) if a collision occurs between the biker and a Pokémon


## Authors and Acknowledgements

This game was created by Mike Koscinski in June of 2020. It is his first programming project.

Ackowledgements and sincere thanks must be extended to the following sources, without which this game would not be possible:

Images:
- Pokémon sprites were graciously obtained from https://pokemondb.net/sprites.
- Background images were obtained from the opening cut scenes of Pokémon Emerald for GameBoy Advance. They were obtained via a Google Images search. Unfortunately, I do not remember the specific site I obtained them from. 
- Character images were obtained from Giphy: https://giphy.com/gifs/pokemon-emerald-LJGpExgmRpUbK. They were modified using several free online image editors. 

Guidance:
- This game was inspired by a JavaScript tutorial created by the Code Explained YouTube channel (https://www.youtube.com/watch?v=L07i4g-zhDA). This tutorial walks viewers through the creation of a Flappy Bird clone. The core logic of my game (its draw function) was informed by this tutorial.


## Opportunities for Improvement

The code for this game is _very_ imperative. It could be more concise if it made better better use of JavaScript's in-built functions.

The game engine is _memory intensive_. I mentioned earlier that each frame of the game is redrawn. However, old frames are not discarded from working memory. Consequently, performance atrophy increases as the duration of the gameplay session does. This is not ideal and should be corrected in the future.


## Project Status

This game is still in active development.


## Easter Eggs

This game was inspired by Flappy Bird (2013) and the Pokémon anime, S1E46, "Attack of the Prehistoric Pokémon". Creating this game indulged its author's nostalgia. He hopes it will indulge yours, too. 

Astute observers of the game's scenery will note the peculiarity of the background's green grass. The game's scene could only take place at the North or South Pole, due to the reoccuring reflections of the sun that grace the top of the ocean. (To the author's knowledge, green grass is uncommon at Earth's poles.)