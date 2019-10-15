const WebSocket = require('ws');

class WebsocketHandler
{

    constructor()
    {
        this.port=8000;
        this._websocket=null;
        this._clients=[];
        this._msgCount=0;
    }

    start()
    {

        setInterval(()=>
        {
            this.send({msg:"test"+this._msgCount++});
        },1000);
        const wss = new WebSocket.Server(
            {
                port: this.port,
                perMessageDeflate: false
            });

        console.log('starting websocket server on port '+this.port);
        
        wss.on('connection', function connection(websock)
        {
            this._clients.push(websock);
            console.log('[websocket] client has connected! ('+this._clients.length+')');
            this._logNumClients();

            websock.on('close', function close() {
                console.log('[websocket] client disconnected');
                this._removeClient(websock);
            }.bind(this));
        
            websock.on('message', function incoming(message)
            {
                console.log('received: ', message);
            });
            websock.on('error', function(error)
            {
                if(error != null)
                {
                    console.log('error: %s', error);
                    this._removeClient(websock);
                    websock.close();
                    websock._socket.destroy();
                    Client.splice(findClient(websock.upgradeReq.url));
                }
            }.bind(this));
        
        }.bind(this));
    }

    _logNumClients(ws)
    {
        console.log('[websocket] numclients '+this._clients.length);
    }

    _removeClient(ws)
    {
        this._clients.splice(this._clients.indexOf(ws));
        this._logNumClients();
    }

    send(msg)
    {
        var str=JSON.stringify(msg);
        
        for(var i=0;i<this._clients.length;i++)
        {
            if (this._clients[i].readyState !== WebSocket.OPEN) { 
                console.log('[websocket] client '+i+' readystate ',this._clients[i].readyState);
                continue;
            } 
        
            this._clients[i].send(str);
        }

    }

}


const wsh=new WebsocketHandler();
wsh.start();