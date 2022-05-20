//Encapsulate DB access and Schema for a Gmae State in the State machine


class GameState {

  constructor(state) {
    const mongodb = context.services.get("mongodb-atlas");
    this.userCollection = mongodb.db("tamagotchi").collection("gamestates");
  }
  
  getMessage() {
    return this.state.msg;
  }
  
  getOptions() {
    return this.state.options;
  }
  
  getFace() {
    return this.state.face
  }
  
  getOption(x) {
    return this.state.options[x];
  }
  
  getHealthChange() {
    if(this.state.updates && this.state.updates.health) {
      return this.state.updates.health;
    }
    return 0;
  }
  
  getId() {
    return this.state._id;
  }
  
  async loadState(state) {
    


    this.state = await this.userCollection.findOne({_id:state});
    if(this.state == null) {
          console.log(`State ${state} not found!`);
          this.state = await this.userCollection.findOne({_id:0}) ;//Special 'Void' State
    }
  }
}

exports = async function(state){
  
  const rval = new GameState();
  await rval.loadState(state);
  return rval;
  
};