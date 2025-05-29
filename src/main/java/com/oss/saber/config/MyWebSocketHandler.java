package com.oss.saber.config;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("클라이언트 연결됨: " + session.getId());
        session.sendMessage(new TextMessage("서버에 연결되었습니다!"));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("클라이언트로부터 메시지: " + message.getPayload());
        // 받은 메시지 그대로 클라이언트에 다시 보냄 (에코)
        session.sendMessage(new TextMessage("서버 응답: " + message.getPayload()));
    }
}
