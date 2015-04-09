package {
import flash.display.Sprite;
import flash.events.Event;
import flash.events.MouseEvent;
import flash.system.Security;

public class SocketTest extends Sprite {
    private var msg:String = '<stream:stream xmlns="jabber:client" to="jabber.ru" version="1.0" xmlns:stream="http://etherx.jabber.org/streams" />';
    private var policy:String = "xmlsocket://195.88.209.185:5229/crossdomain.xml";
    private var server:String = "195.88.209.185";
    private var port:int = 5222;

    public function SocketTest():void {
        addEventListener(Event.ADDED_TO_STAGE, on_add);
    }

    private function on_add(event:Event):void {
        removeEventListener(Event.ADDED_TO_STAGE, on_add);
        trace("LOADED 13!!!");

        Security.loadPolicyFile(policy);

//        var soc:XMLSocTest = new XMLSocTest(server, port, msg);
        var soc:SocTest = new SocTest(server, port, msg);

        var btn:Sprite = new Sprite();
        btn.graphics.beginFill(0xFF0000);
        btn.graphics.drawCircle(10, 10, 5);
        btn.graphics.endFill();
        this.addChild(btn);
        btn.addEventListener(MouseEvent.CLICK, soc.on_send);
    }


}
}