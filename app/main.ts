import { GameState, Direction } from "../libs/model";
import { GameClient } from "../libs/game-client";

import { config } from "./config";

const gameClient = new GameClient(config);

gameClient.onGameStart((): void => {
	console.log("Game started!");
});

let  lastDirection;

gameClient.onGameUpdate((gameState: GameState): void => {
	const { width, height, players } = gameState;

	let fixY, fixX = false
	const otherPlayers = players.filter((user) => user.playerId !== config.id);
	const myLastCod = players.find((user) => user.playerId === config.id).coordinates.pop();
	const otherUserLastCod = otherPlayers[0].coordinates.pop();

	const currentPlayer = players.find((user) => user.playerId === config.id)
	// const otherUserLastCod = otherUsers[0].coordinates.pop();
	//check if x and y are not >=1 else check lefta nd right for other players
	//diffrence from other user and my last cod x  cord must be 3 > than my last cod x cord



	const closestX = Math.min(...otherPlayers.map(player => Math.abs(player.coordinates.pop().x - myLastCod.x)));
	const closestY = Math.min(...otherPlayers.map(player => Math.abs(player.coordinates.pop().y - myLastCod.y)));


	const notOutOfBounds = (!(myLastCod.x <= 3|| myLastCod.y <= 3) && !(myLastCod.x+3 >= width || myLastCod.y >= height - 3));

	console.log({closestX, closestY, myLastCod, height : height, width: width, notOutOfBounds})


	if (notOutOfBounds && (closestX <= 3 && closestY <= 3)) {
		console.log('Nothing');
	}
	else {
		if (notOutOfBounds) {

			if (myLastCod.x + 2 <= closestX && myLastCod.y + 2 <= closestY) {
				console.log('Up');
				return gameClient.sendAction(Direction.UP, gameState.iteration);
			} else if (myLastCod.x + 2 <= closestX && myLastCod.y - 2 <= closestY) {
				console.log('Down');
				return gameClient.sendAction(Direction.DOWN, gameState.iteration);
			} else if (myLastCod.y + 2 <= closestY && myLastCod.x + 2 <= closestX) {
				console.log('Left');
				return gameClient.sendAction(Direction.LEFT, gameState.iteration);
			} else  if (myLastCod.y +2 <= closestY && myLastCod.x - 2 <= closestX) {
				console.log('Right');
				return gameClient.sendAction(Direction.RIGHT, gameState.iteration);
			}else {
				return
			}
		}
		else {
			console.log(' out of bounds', ((myLastCod.x <= 3  && !fixY) || height - 3 <= myLastCod.y ), ((myLastCod.y <= 3 && !fixX) || width - 3 <= myLastCod.x));
			const xCodOutOfBounds = (myLastCod.x <= 3  && !fixY) || width - 3 <= myLastCod.x
			const yCodOutOfBounds = (myLastCod.y <= 3 && !fixX) || height - 3 <= myLastCod.y
			console.log({xCodOutOfBounds, yCodOutOfBounds})
			if((myLastCod.x <= 3  && !fixY) || width - 3 <= myLastCod.x ) {
				fixY = true
				if ((myLastCod.y + 1 > closestY || closestY > (myLastCod.y+1)+2) &&  (width  > (myLastCod.x +2)  &&  myLastCod.x - 2 >= 2)) {
					const dire = lastDirection === Direction.RIGHT && !xCodOutOfBounds ? Direction.UP : Direction.RIGHT
					lastDirection = dire
					console.log('Up');
					return gameClient.sendAction(dire, gameState.iteration);
				} else if ((myLastCod.y - 1 < closestY || closestY > (myLastCod.y-1)-2) &&  (width  > (myLastCod.x +2)  &&  myLastCod.x + 2 >= 2)) {
					const dire = lastDirection === Direction.LEFT && !xCodOutOfBounds ? Direction.DOWN : Direction.LEFT
					lastDirection = dire
					console.log('Down');
					return gameClient.sendAction(dire, gameState.iteration);
				}
			} else if((myLastCod.y <= 4 && !fixX) || height - 4 <= myLastCod.y) {
				fixX = true
				if (((myLastCod.x + 1 > closestX || closestX > (myLastCod.x + 1) + 2) &&  (height  > (myLastCod.y +2)  &&  myLastCod.y + 2 >= 2)) || width <= myLastCod.x +3 ) {
					let dire: Direction.UP | Direction.DOWN | Direction.RIGHT = lastDirection === Direction.RIGHT ? Direction.DOWN : Direction.RIGHT
					if (myLastCod.y +2 == 99 && lastDirection === Direction.RIGHT)  dire = Direction.UP
					console.log('Right', {dire, isFa:myLastCod.y +3 >= height, mya:myLastCod.y+2, height});
					lastDirection = dire
					return gameClient.sendAction(dire, gameState.iteration);
				} else if ((myLastCod.x - 1 < closestX || closestX > (myLastCod.x - 1) - 2) &&  (height  > (myLastCod.y +2)  &&  myLastCod.y - 2 >= 2) || width <= myLastCod.x +3 ) {
					const dire = lastDirection === Direction.LEFT && !yCodOutOfBounds ? Direction.UP : Direction.LEFT
					lastDirection = dire
					console.log('Left', {dire});
					return gameClient.sendAction(dire,gameState.iteration);
				}
			}
		}
	}
});

gameClient.run();
