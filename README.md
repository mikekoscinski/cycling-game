# The Pokémon Cycling Game

Single-player, side-scrolling game for adventure, cycling, and pokémon enthusiasts alike. Players take the role of a biker, who must avoid oncoming prehistoric pokémon to complete the longest bike ride possible.

(This game is not endorsed by or affiliated with Nintendo or The Pokémon Company.)


## Description

This game was written in JavaScript. It makes modest use of HTML and CSS as well.

The game engine relies on one custom JavaScript function: draw. This function:
- Causes the background image to scroll infinitely
- Draws new, oncoming Pokémon, with the following probabilities: 32.5% (Kabuto, Omanyte), 15% chance (Kabutops, Omastar), 5% (Aerodactyl). The pokémon's x-position on the canvas is automatically assigned based on whether or not it flies
- Allows the biker to jump and descend
- Maintains the game timer (bottom left corner) based on real UTC time
- Reloads the screen (i.e. game over) if a collision occurs between biker and Pokémon


## Authors and Acknowledgements

This game was created by Mike Koscinski in June of 2020. It is his first programming project. Other sources include:

Images:
- Pokémon sprites: https://pokemondb.net/sprites
- Background images: opening cut scenes of Pokémon Emerald (GameBoy Advance)
- Biker images: Giphy: https://giphy.com/gifs/pokemon-emerald-LJGpExgmRpUbK

Guidance:
- This game was inspired by a JavaScript tutorial created by the Code Explained YouTube channel (https://www.youtube.com/watch?v=L07i4g-zhDA). This tutorial walks viewers through the creation of a Flappy Bird (2013) clone


## Opportunities for Improvement

The code for this game is _very_ imperative. It could be more concise if it made better better use of JavaScript's in-built functions.

The game engine is _memory intensive_. I mentioned earlier that each frame of the game is redrawn. However, old frames are not discarded from working memory. Consequently, performance atrophy increases as the duration of the gameplay session does. This is not ideal and should be corrected in the future.

Currently, the game's timer and music continue to run if the user navigates to a different browser tab. However, doing so also pauses the draw function, allowing the user to avoid collisions indefinitely. This can be used to register a hypothetically infinite high score. An ideal solution would allow oncoming pokemon to be continuously drawn even if the user has navigated to a different tab. Without user intervention, this would eventually cause the biker to collide with an oncoming pokémon, thereby ending the game. **Note** that this issue applies only to tabs on the same browser window. If the user has two browser windows, so long as the Pokemon Cycling Game is open in its window's active tab (even if that window is not the _active_ window), frames will continue to be drawn.


## Project Status

This game is still in active development.


## Easter Eggs

This game was inspired by Flappy Bird (2013) and the Pokémon anime, S1E46, "Attack of the Prehistoric Pokémon". Creating this game indulged its author's nostalgia. He hopes it will indulge yours, too. 

Astute observers of the game's scenery will note the peculiarity of the background's green grass. The game's scene could only take place at the North or South Pole, due to the reoccuring reflections of the sun that grace the top of the ocean. (To the author's knowledge, green grass is uncommon at Earth's poles.)