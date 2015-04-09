package {
import flash.events.Event;
import flash.events.IOErrorEvent;
import flash.events.MouseEvent;
import flash.events.ProgressEvent;
import flash.events.SecurityErrorEvent;
import flash.net.Socket;

public class SocTest {
    private var socket:Socket;
    private var msg:String;

    public function SocTest(server:String, port:int, _msg:String) {
        msg = _msg;
        socket = new Socket();
        socket.addEventListener(Event.CLOSE, closeHandler);
        socket.addEventListener(Event.CONNECT, connectHandler);
        socket.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
        socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
        socket.addEventListener(ProgressEvent.SOCKET_DATA, socketDataHandler);

        socket.addEventListener(Event.CLOSE, disconnectHandler);
        socket.addEventListener(IOErrorEvent.IO_ERROR, disconnectHandler);
        socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, disconnectHandler);

        socket.connect(server, port);
    }

    private function disconnectHandler(event:Event):void {
        trace("disconect!", this);
    }

    private function socketDataHandler(event:ProgressEvent):void {
        trace("socketDataHandler!", this);

        var incoming:String = socket.readUTFBytes(socket.bytesAvailable);
        trace("IN : " + incoming);
    }

    private function securityErrorHandler(event:SecurityErrorEvent):void {
        trace("securityErrorHandler!", this);
    }

    private function ioErrorHandler(event:IOErrorEvent):void {
        trace("ioErrorHandler!", this);
    }

    private function connectHandler(event:Event):void {
        trace("connectHandler!", this);
    }

    private function closeHandler(event:Event):void {
        trace("closeHandler!", this);
    }

    public function on_send(event:MouseEvent):void {
        trace("OUT: " + msg);
        try {
            socket.writeUTFBytes(msg);
            socket.flush();
        }
        catch (error:Error) {
            trace("Error writing to socket: " + error);
        }
    }
}
}
