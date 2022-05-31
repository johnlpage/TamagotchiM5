
//Var so I can run this multiple times

var gameData = cat("/Users/jlp/Downloads/untitled.json");
gameData = JSON.parse(gameData)
var db = db.getSiblingDB("tamagotchi")

db.gamestates.deleteMany({})

gameStates = {}

gameStates[0] = { _id:0,
     msg: "I can't continue.\nIs this the End\nMy Friend?",
     options: [{name:"",to:1},{name:"Restart",to:1},{name:"",to:1}],
     gfx:[],
     updates:{}
}

//States = Rooms
for(state of gameData.elements ) {
    if(state._type == "Room") {
        var gameRec = { _id: state.id,
        msg: state._description,
        options:[],
        updates:{}
        }

        if(state._subtitle && state._subtitle.length >0) {
            print(state._subtitle)
            face = JSON.parse(state._subtitle)
            printjson(face)
            gameRec.face = face
        }

        //Objects are use to control variables
        if(state.objects) {
            for(ob of state.objects) {
                gameRec.updates[ob._name] =parseInt( ob._description)
            }
        }

        gameStates[state.id] = gameRec
    }
}


//Options = Connectors
for(state of gameData.elements ) {
    if(state._type == "Connector") {
      var name = state._name;
      var to = state._dockEnd
      var from = state._dockStart
      gameStates[from].options.push({name,to})
    }
}

printjson(gameStates)

var newRecs = []
for( id in gameStates){
    //If only one option put it in the middle
    var stateRec = gameStates[id]
    if(stateRec.options.length ==  1) {
        stateRec.options = [{name:"",to: stateRec.options[0].to} , stateRec.options[0],{name:"",to: stateRec.options[0].to} ]
    }

    
    if(stateRec.options.length != 3) {
        throw("ERROR - 1 or 3 options only");
    }

    newRecs.push(stateRec)
}

printjson(newRecs)
printjson(db.gamestates.insertMany(newRecs))