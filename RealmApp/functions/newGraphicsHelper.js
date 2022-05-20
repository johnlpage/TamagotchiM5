//Next step is to build a database based state machine
//That looks at the current state, health, turns, location??
//And returns relevant responses for a meaningful Game


class GraphicsHelper {

  constructor() {
    this.tx=256
    this.ty=120
    this.sz = 64
  }
  
  //Add code in here to restyle according to the gamestate.
  //Basically Size, Pupil shape and Mouth direction
  
  renderEyes(eyeDesc)
  {
    const {ex,ey,px,py} = eyeDesc;
    let rval = []
    
    // eyes 1/3 down
    const eyetop = Math.floor(this.ty+(this.sz/3)-(ey/2))
    const eyeleft = Math.floor(this.tx+(this.sz/3)-(ex/2))
    
    const exd = Math.floor((ex-px)/2)
    const eyd = Math.floor((ey-py)/2)
    
    rval.push({x:eyeleft,y:eyetop,rx:ex,ry:ey,c:1})
    rval.push({x:eyeleft+exd,y:eyetop+eyd,rx:px,ry:py,c:0})
    
    const eyeright = Math.floor(this.tx+(2*(this.sz/3))-(ex/2))
    rval.push({x:eyeright,y:eyetop,rx:ex,ry:ey,c:1})
    rval.push({x:eyeright+exd,y:eyetop+eyd,rx:px,ry:py,c:0})
    
    return rval
  }
  
  renderMouth(mouthDesc)
  {
    const {mx,my,ix,iy,io} = mouthDesc
    let rval = []
    // eyes 1/3 down
    const mouthtop = Math.floor(this.ty+(2*(this.sz/3))-(my/2))
    const mouthleft = Math.floor(this.tx+(this.sz/2)-(mx/2))
    
    const mxd = Math.floor((mx-ix)/2)
    const myd = Math.floor((my-iy)/2)
    
    rval.push({x:mouthleft,y:mouthtop,rx:mx,ry:my,c:1})
    rval.push({x:mouthleft+mxd,y:mouthtop+myd+io,rx:ix,ry:iy,c:0})
    
    return rval
  }
  
  
  render( userRec, gameState) {
    let rval = []
    
    //Blank an area 
    rval.push( { x:this.tx, y:this.ty, rx: this.sz, ry: this.sz, c:0 })
    
    const eyeDefault = {"ex":15,"ey":15,"px":5,"py":10}
    const mouthDefault = {"mx":50,"my":10,"ix":30,"iy":10,"io":-4}
    
    //Using a logical representation of a face rather than embedding the gfx in each record.
    face = gameState.getFace();
    if(face) {
      if(face.eyes) {
       rval = rval.concat(this.renderEyes(face.eyes))
      } else {
        rval = rval.concat(this.renderEyes(eyeDefault))
      }
      if(face.mouth) {
       rval = rval.concat(this.renderMouth(face.mouth))
      } else {
        rval = rval.concat(this.renderMouth(mouthDefault))
      }
      
    }  else {
        rval = rval.concat(this.renderEyes(eyeDefault))
        rval = rval.concat(this.renderMouth(mouthDefault))
      }
    

    console.log("GFX: " + JSON.stringify(rval))
    return rval;
  }
  
}
exports = function(arg){
  return new GraphicsHelper();
};