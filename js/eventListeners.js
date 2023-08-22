const setEventListeners = () =>{
    window.addEventListener("keydown",(ev)=>{
        game.handleKeyDown(ev);
    });
    window.addEventListener("keyup",(ev)=>{
        game.handleKeyUp(ev);
    });
}