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
	console.log('I need this',{myLastCod, otherUserLastCod})

	const currentPlayer = players.find((user) => user.playerId === config.id)
	// const otherUserLastCod = otherUsers[0].coordinates.pop();
	//check if x and y are not >=1 else check lefta nd right for other players
	//diffrence from other user and my last cod x  cord must be 3 > than my last cod x cord


	let closestCoordinate = null;
	let minDistance = Infinity;

	otherPlayers.forEach(player => {
		player.coordinates.forEach(coordinate => {
			const distance = Math.sqrt((coordinate.x - myLastCod.x) ** 2 + (coordinate.y - myLastCod.y) ** 2);
			if (distance < minDistance) {
				minDistance = distance;
				closestCoordinate = coordinate;
			}
		});
	});

	const closestX = closestCoordinate.x;
	const closestY = closestCoordinate.y;

	const closeTOEnemy = myLastCod.x+2>=closestX && myLastCod.y+2>=closestY;


	const notOutOfBounds = (!(myLastCod.x <= 3|| myLastCod.y <= 3) && !(myLastCod.x+3 >= width || myLastCod.y >= height - 3));

	console.log({closestX, closestY, myLastCod, height : height, width: width, notOutOfBounds})


	if (notOutOfBounds && (closestX <= 3 && closestY <= 3)) {
		console.log('Nothing');
	}
	else {
		if (notOutOfBounds) {
			console.log("close to enemy", closeTOEnemy)

			if (myLastCod.x + 2 <= closestX && myLastCod.y + 2 <= closestY && closeTOEnemy) {
				console.log('Up');
				return gameClient.sendAction(Direction.UP, gameState.iteration);
			} else if (myLastCod.x + 2 <= closestX && myLastCod.y - 2 <= closestY&& closeTOEnemy) {
				console.log('Down');
				return gameClient.sendAction(Direction.DOWN, gameState.iteration);
			} else if (myLastCod.y + 2 <= closestY && myLastCod.x + 2 <= closestX&& closeTOEnemy) {
				console.log('Left');
				return gameClient.sendAction(Direction.LEFT, gameState.iteration);
			} else  if (myLastCod.y +2 <= closestY && myLastCod.x - 2 <= closestX&& closeTOEnemy) {
				console.log('Right');
				return gameClient.sendAction(Direction.RIGHT, gameState.iteration);
			}else if(myLastCod.y + 2 >= closestY && myLastCod.x + 2 >= closestX && closeTOEnemy){
				console.log('Up one');
				return gameClient.sendAction(Direction.UP, gameState.iteration);
			}else if(myLastCod.y + 2 >= closestY && myLastCod.x - 2 >= closestX && closeTOEnemy){
				console.log('Down');
				return gameClient.sendAction(Direction.DOWN, gameState.iteration);
			}else if(closeTOEnemy && closestY <= myLastCod.y+1 && myLastCod.x + 1 >= width) {
				console.log('please left')
				return gameClient.sendAction(Direction.LEFT, gameState.iteration);
			}else if(closeTOEnemy && closestY <= myLastCod.y-1 && myLastCod.x + 1 >= width) {
				console.log('please left')
				return gameClient.sendAction(Direction.LEFT, gameState.iteration);
			}else if(closeTOEnemy && closestY <= myLastCod.y+1 && myLastCod.x - 1 <=0) {
				console.log('please left')
				return gameClient.sendAction(Direction.LEFT, gameState.iteration);
			}else if(closeTOEnemy && closestX <= myLastCod.x-1 && myLastCod.y - 1 <=0) {
				console.log('please Up')
				return gameClient.sendAction(Direction.UP, gameState.iteration);
			}else if(closeTOEnemy && closestX <= myLastCod.x+1 && myLastCod.y - 1 <=0 && myLastCod.y - 1 !== closestY) {
				console.log('please Up')
				return gameClient.sendAction(Direction.UP, gameState.iteration);
			}{
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
					const dire = lastDirection === Direction.RIGHT && !xCodOutOfBounds && closeTOEnemy ? Direction.UP : Direction.RIGHT
					lastDirection = dire
					console.log('Up, ooo');
					return gameClient.sendAction(dire, gameState.iteration);
				} else if ((myLastCod.y - 1 < closestY || closestY > (myLastCod.y-1)-2) &&  (width  > (myLastCod.x +2)  &&  myLastCod.x + 2 >= 2)) {
					let dire: Direction.DOWN | Direction.LEFT | Direction.UP = lastDirection === Direction.LEFT && !xCodOutOfBounds ? Direction.DOWN : Direction.LEFT
					if(myLastCod.x +2 > 98 && lastDirection === Direction.RIGHT) dire = Direction.UP
					lastDirection = dire
					console.log('Down?,', dire);
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
			}else if(yCodOutOfBounds && myLastCod.x+1== width){
				console.log('go left');
				return gameClient.sendAction(Direction.LEFT,gameState.iteration);
			}else  if(yCodOutOfBounds && myLastCod.x-1 == 0) {
				console.log('go right');
				return gameClient.sendAction(Direction.RIGHT, gameState.iteration);
			}else if(xCodOutOfBounds && myLastCod.y+1== height) {
				console.log('go up');
				return gameClient.sendAction(Direction.UP, gameState.iteration);
			}else if(xCodOutOfBounds && myLastCod.y-1== 0) {
				console.log('go down');
				return gameClient.sendAction(Direction.DOWN, gameState.iteration);
			}
		}
	}
});

gameClient.run();
