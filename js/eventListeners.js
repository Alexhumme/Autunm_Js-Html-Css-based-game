const setEventListeners = () =>{
    window.addEventListener("keydown",(ev)=>{
        config.keys = (config.keys || []);
        config.keys[ev.keyCode] = true;
        config.player.idle = false;
    });
    window.addEventListener("keyup",(ev)=>{
        config.keys[ev.keyCode] = false;
        config.player.idle = true;
        (ev.key === ("a") || ev.key === ("d"))
        && config.player.element.classList.remove("run")
        config.player.element.classList.add("idle")
    });
}