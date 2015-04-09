/**
 * Created by mihail on 4/9/15.
 */
package {
import flash.events.DataEvent;
import flash.events.Event;
import flash.events.IOErrorEvent;
import flash.events.MouseEvent;
import flash.events.ProgressEvent;
import flash.events.SecurityErrorEvent;
import flash.net.XMLSocket;

public class XMLSocTest {
    private var socket:XMLSocket;
    private var msg:String;

    public function XMLSocTest(server:String, port:int, _msg:String) {
        msg = _msg;
        socket = new XMLSocket();
        socket.addEventListener(Event.CLOSE, closeHandler);
        socket.addEventListener(Event.CONNECT, connectHandler);
        socket.addEventListener(DataEvent.DATA, dataHandler);
        socket.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
        socket.addEventListener(ProgressEvent.PROGRESS, progressHandler);
        socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
        trace("connecting..");
        socket.connect( server, port );
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

    public function on_send(event:MouseEvent):void {
        trace("on_send", socket.connected);
        socket.send(msg);
    }
}
}
