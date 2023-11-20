import { ChatMessage } from './../models/chat-message';
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any
  private messageSubject: BehaviorSubject<ChatMessage[]>=new BehaviorSubject<ChatMessage[]>([]);

  constructor(){
    this.iniConnectionSocket();
  }

  iniConnectionSocket(){
    const url='//localhost:3000/chat-socket';
    const socket= new SockJS(url);
    this.stompClient=Stomp.over(socket)

  }

  joinRoom(roomId:string){
    this.stompClient.connect({},()=>{
      this.stompClient.subscribe(`/topic/${roomId}`, (messages:any)=>{
        const messageContent =JSON.parse(messages.body);
        //console.log(messageContent);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);
        this.messageSubject.next(currentMessage);
      })
    })
  }

  senMessage(roomId: string, chatMessage: ChatMessage){
    this.stompClient.send(`/app/chat/${roomId}`,{},JSON.stringify(chatMessage))
  }

  getMessageSubject(){
    return this.messageSubject.asObservable();
  }

}
