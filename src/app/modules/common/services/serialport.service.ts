import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SerialPortService {

  private port: any;
  private options = { baudRate: 9600, dataBits: 8, parity: 'none', bufferSize: 256, flowControl: 'none' }; //Default
  private writer: any;
  private controlCharacter: string = "\n";
  private reader:any;
  private readableStreamClosed:any;
  private writableStreamClosed:any;
  private keepReading:boolean = true;
  commandResult: Subject<any> = new Subject();

  constructor() { 
  }

  //Must be used by a request from a button
  async connect() {
    this.keepReading = true;
    const sucessfulRequestPort = await this.requestPort();
    if(sucessfulRequestPort) {
      await this.open();
    }
  }

  async requestPort() {
    let requested = false;
    
    if ('Serial' in navigator) {
      let nav: any = navigator;
      const ports = await nav.serial.getPorts();

      try {
        this.port = await nav.serial.requestPort();
        requested = true;
      } catch (error) {
        console.error("Requesting port error: " + error);
      }
    }
    // The Web Serial API is supported by the browser.
    else {
      console.error("This browser does NOT support the Web Serial API");
    }

    return requested;
  }

  async open() {
    try {
      await this.port.open(this.options);

      this.setTextEncoderStream();

      this.readLoop();

     } catch (error) {
       console.error("Opening port error: " + error);
       return;
     }
  }

  async close() {
    if(this.port) {
      this.keepReading = false;
      this.reader.cancel();
      await this.readableStreamClosed.catch(() => {});
      this.writer.close();
      await this.writableStreamClosed;
      await this.port.close();
  
      this.port = null;
    }
  }

  async send(command: string) {
    if(this.port) {
      await this.writer.write(command);//L2\n
    }
  }

  setOptions(options: any) {
    this.options = options;
  }

  setControlCharacter(controlCharacter: string) {
    this.controlCharacter = controlCharacter;
  }

  private setTextEncoderStream() {
     const textEncoder = new TextEncoderStream();
     this.writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
     this.writer = textEncoder.writable.getWriter();
  }

  private setTextDecoderStream() {
    const textDecoder = new TextDecoderStream();
    this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    this.reader = textDecoder.readable
      .pipeThrough(new TransformStream(new LineBreakTransformer(this.controlCharacter)))
      .getReader();
  }

  private async readLoop() {
    while (this.port.readable && this.keepReading) {
      this.setTextDecoderStream();
      try {
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) {
            break;
          }
          if (value) {
            this.dataHandler(value);
          }
        }
      } catch (error) {
        console.error("Read Loop error. Have the serial device been disconnected ? ");
      }
    }
  }

  private dataHandler(data: string) {
    this.commandResult.next(data);
  }
}
class LineBreakTransformer {
  container: any = "";
  private controlCharacter: string;

  constructor(controlCharacter: string) {
    this.container = '';
    this.controlCharacter = controlCharacter
  }

  transform(chunk: any, controller: any) {
    this.container += chunk;
    const lines = this.container.split(this.controlCharacter);
    this.container = lines.pop();
    lines.forEach((line: any) => controller.enqueue(line));
  }

  flush(controller: any) {
    controller.enqueue(this.container);
  }
}