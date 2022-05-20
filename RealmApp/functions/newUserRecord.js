//DAL class wrapping all database interaction and hiding schema
//We can update and version schema as needed
class User {

  getName() 
  {
    return this.data.name;
  }
  
  getHealth() {
    return this.data.health;
  }
  
  getBornAt() {
    return this.data.getBorn;
  }
  
  getTurns() {
    return this.data.turn;
  }
  
  getGameState() {
    return this.data.gameState;
  }
  

  stageUpdate(type,key,value) {
      //Stage the change rather than do it
    if ( type in this.updates)
    {
      this.updates[type][key] = value
    } else {
      tmp={}
      tmp[key] = value
      this.updates[type] = tmp
    }
  }
  
  modifyHealth(value)
  {
    console.log(`Changing Health ${this.data.health} + ${value}`)
    this.data.health =   this.data.health + value
    if(this.data.health < 1) { this.data.health=1 }
    if(this.data.health >100) { this.data.health = 100; }
    this.stageUpdate("$set","health",this.data.health);
  }
  
  
  incrementTurn() {
    this.stageUpdate("$inc","turn",1);
    this.data.turn++;
  }
  
  
   setGameState(state) {
    this.stageUpdate("$set","gameState",state);
    this.data.gameState = state;
  }
  
  async commitChanges()
  {
    console.log(JSON.stringify(this.updates))
    const { matchedCount, modifiedCount } = await this.userCollection.updateOne({_id:this.data._id},this.updates);
    //TODO chcke r has 1 update
    this.updates={}
    return matchedCount;
  }
  
  constructor() {
    const mongodb = context.services.get("mongodb-atlas");
    this.userCollection = mongodb.db("tamagotchi").collection("users");
    this.data = {}
    this.updates = {}
  }
  
  //Constructors cannot be async
  async init(name,password)
  {
    const hashpass = utils.crypto.hash("sha256",password).toBase64()
    const _id = `${name}_${hashpass}`
    
    await this.getUserRecordFromDB(_id);

    if(this.data == null) {
      await this.createNewUser(_id,name)
    }
    
    if(this.data == null) {
        throw 'Unable to create find or create user'
    }
  }
  
  async createNewUser(_id,name)
  {
    this.data = { _id, name, health: 100, born: new Date(), turn: 0 , gameState: 1, schemaVersion: 1};
    console.log(`Creating New User ${_id}`)
    await this.userCollection .insertOne(this.data); //TODO Error handling
  }

  async getUserRecordFromDB(_id) {
    //Fetch the record and if not create it
    this.data = await this.userCollection .findOne({_id})
  }
}

exports = async function(name,password){
  userClass =  new User();
  if(name && password) {
    await userClass.init(name,password)
  }
  return userClass;
};