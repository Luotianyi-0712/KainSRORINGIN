import { Injectable } from '@nestjs/common';
import { Socket } from 'net';

@Injectable()
export class GameServerService {
    handleConnection(socket: Socket): void {
        // this.clientSocket = socket;
        // this.run().catch((err) => {
        //     console.error('Error handling session:', err);
        // });
    }
}