var fs = nativeRequire('fs')
var path = nativeRequire('path')
var drum_map = new Array(127)
var varkit=0
var a = Date.now()
var b = a
fs.readdir("C:/Program Files/open-stage-control/Drum maps", (err, files) => {
    menu_drummaps= new Array() ;
    if (err) 
        console.error(err);
    else {
         files.forEach(file => {
         if (path.extname(file) == ".drmp")
            {menu_drummaps.push(file);}
            })
            }})
         
for (let i=0;i<128;i++)
    {drum_map[i]=i;}
    module.exports = {
    init: function(){ },
    
    oscInFilter:function(data)
    {
        // Filter incoming osc messages
       var {address, args, host, port} = data
              
             
        if (address === '/knock_knock') {
            receive ('/Qui est la ?',menu_drummaps)
        return}
        
        if (address === '/varoff')
        {varkit=0
        return}
        if (address === '/varon')
        {   varkit=1;
            a = Date.now()
            return
        }
                
        b = Date.now()
           if (((b-a)>5000) && (varkit===1))   
            {
              receive ('/SET','alea2',1)
              a=b    
            }
                        
        if ((port === "Clavier") && (address==='/note'))
              {  
                   
           let y= drum_map[args[1].value];
           receive ('/touche',args[1].value,args[2].value)
           receive ('/jouenote',1)
           send ('midi','RC600','/sysex','99',(y),(args[2].value));
           return
          
          
           //return{address, args, host, port} 
             }
      
        
        //
        // do what you want
        // address = string
        // args = array of {value, type} objects
        // host = string
        // port = integer
        // return data if you want the message to be processed
        //
       if (args[0].value=== "f8")
       { 
       return{address, args, host, port} 
       }
    },

    oscOutFilter:function(data){
        
        // Filter outgoing osc messages
        var {address, args, host, port, clientId} = data
        if (address ==='/note')
           {
            args[1].value = drum_map[(args[1].value)]
           } 
        if (address === '/file') {
                args[0].value = "Drum maps/" + args[0].value
                fs.readFile(args[0].value, 'utf8' , (err, data) => {
                if (err) {
                    console.error(err)
                         }
                var decoupe = data.split('\r\n')
                for (i=0;i<128;i++)
                {drum_map[i]=Number(decoupe[i])}
                // 
            })
          
            return} 
        // bypass original message
        // same as oscInFilter
        // return data if you want the message to be and sent
        return {address, args, host, port}
    },

    unload: function(){
        // this will be executed when the custom module is reloaded
    },

}