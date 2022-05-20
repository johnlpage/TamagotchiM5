

exports = async function({ query, headers, body}, response) {
  
   let rval = {
        status: "Error",
        msg: "Sorry I'm having a problem",
        gfx :  [],
        options : ["","Retry",""]
   }
        
   try {
      //Headers are auto capitalised
      const name = headers.Name[0]
      const secret = headers.Secret[0]
      const data = JSON.parse(body.text())
      const buttonPressed = data.choice
      
      //Wrap the user in a DAL
      const userRecord = await context.functions.execute("newUserRecord",name,secret)
      const gameEngine = context.functions.execute("newGameEngine")
      rval = await gameEngine.turn(userRecord,buttonPressed);
      console.log(JSON.stringify(rval))
    }
    catch (e) {
      rval.msg = `UGS: ${e.message}`  
    }
   
    response.setBody(JSON.stringify(rval))
    response.setStatusCode(200)
}