//Next step is to build a database based state machine
//That looks at the current state, health, turns, location??
//And returns relevant responses for a meaningful Game


class GameEngine {

  constructor() {
      this.graphicsHelper = context.functions.execute("newGraphicsHelper")
  }

  async turn(userRec,buttonPressed) {
    //Read Details of Current state
    const gameState =  await context.functions.execute("newGameState",userRec.getGameState())
    userRec.incrementTurn();
    
 
    
    //Depending on the button pressed move to the new state and return the message
    const action=gameState.getOption(buttonPressed)
    
    if(action != null) {
      //Simplest Engine - Just change state
      userRec.setGameState(action.to)
    }
    
    
    //Read the new State and options
    const newGameState =  await context.functions.execute("newGameState",userRec.getGameState())
    
    const healthUpdate = newGameState.getHealthChange()
    if(healthUpdate) {
      userRec.modifyHealth(healthUpdate)
    }
    
    const success = await userRec.commitChanges();
    return this.response(userRec,newGameState);
  }
  

  
  response(userRec,gameState) {
    
    let gfx = this.graphicsHelper.render(userRec,gameState);
    
    let options = gameState.getOptions().map( o => o.name);
    let rval = {
      status: `${userRec.getName()} Health:${userRec.getHealth()} Turns: ${userRec.getTurns()}`,
      msg: gameState.getMessage(),
      gfx :  gfx,
      options : options
     }
     
     return rval;
  }
  
}
exports = function(arg){
  return new GameEngine();
};