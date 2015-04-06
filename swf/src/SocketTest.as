package {
import flash.display.Sprite;
import flash.events.DataEvent;
import flash.events.Event;
import flash.events.IOErrorEvent;
import flash.events.MouseEvent;
import flash.events.ProgressEvent;
import flash.events.SecurityErrorEvent;
import flash.net.XMLSocket;

public class SocketTest extends Sprite {
    private var socket:XMLSocket;

    public function SocketTest():void {
        addEventListener(Event.ADDED_TO_STAGE, on_add);
    }

    private function on_add(event:Event):void {
        removeEventListener(Event.ADDED_TO_STAGE, on_add);
        trace("LOADED 7!!!");

        try {
            socket = new XMLSocket();
            socket.addEventListener(Event.CLOSE, closeHandler);
            socket.addEventListener(Event.CONNECT, connectHandler);
            socket.addEventListener(DataEvent.DATA, dataHandler);
            socket.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
            socket.addEventListener(ProgressEvent.PROGRESS, progressHandler);
            socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
            trace("connecting..");
            socket.connect( "195.88.209.185", 5229 );
        }
        catch(e:SecurityError) {
            trace("sec err", e);
        }

        var btn:Sprite = new Sprite();
        btn.graphics.beginFill(0xFF0000);
        btn.graphics.drawCircle(10, 10, 5);
        btn.graphics.endFill();
        this.addChild(btn);
        btn.addEventListener(MouseEvent.CLICK, on_send);
    }

    private function securityErrorHandler(event:SecurityErrorEvent):void {
        trace("securityErrorHandler");
    }

    private function progressHandler(event:ProgressEvent):void {
        trace("progress", event.bytesLoaded, "/", event.bytesTotal);
    }

    private function closeHandler(event:Event):void {
        trace("close!");
    }

    private function dataHandler(event:DataEvent):void {
        trace("socketDataHandler", event.toString());
        trace("loaded:", event.data);
    }

    private function connectHandler(event:Event):void {
        trace("conected!", socket.toString());
    }

    private function handleDisconnect(event:Event):void {
        trace("handleDisconnect");
    }

    private function ioErrorHandler(e:Event):void {
        trace("handleError", e.type);
    }

//    private function onData(event:DataEvent):void
//    {
//        trace("[" + event.type + "] " + event.data);
//    }

    private function on_send(event:MouseEvent):void {
        trace("on_send", socket.connected);
        var msg:XML = new XML('<stream:stream xmlns="jabber:client" to="jabber.ru" version="1.0" xmlns:stream="http://etherx.jabber.org/streams" />');
        socket.send(msg);
    }
}
}