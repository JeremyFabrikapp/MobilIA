import { useState, useEffect, useCallback } from 'react';

const BUFFER_SIZE = 4800;

class Player {
  private playbackNode: AudioWorkletNode | null = null;

  async init(sampleRate: number) {
    const audioContext = new AudioContext({ sampleRate });
    await audioContext.audioWorklet.addModule("/audio-playback-worklet.js");

    this.playbackNode = new AudioWorkletNode(audioContext, "audio-playback-worklet");
    this.playbackNode.connect(audioContext.destination);
  }

  play(buffer: Int16Array) {
    if (this.playbackNode) {
      this.playbackNode.port.postMessage(buffer);
    }
  }

  stop() {
    if (this.playbackNode) {
      this.playbackNode.port.postMessage(null);
    }
  }
}

class Recorder {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;

  constructor(private onDataAvailable: (data: ArrayBuffer) => void) {}

  async start(stream: MediaStream) {
    try {
      if (this.audioContext) {
        await this.audioContext.close();
      }

      this.audioContext = new AudioContext({ sampleRate: 24000 });

      await this.audioContext.audioWorklet.addModule("/audio-processor-worklet.js");

      this.mediaStream = stream;
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.mediaStream);

      this.workletNode = new AudioWorkletNode(this.audioContext, "audio-processor-worklet");
      this.workletNode.port.onmessage = (event) => {
        this.onDataAvailable(event.data.buffer);
      };

      this.mediaStreamSource.connect(this.workletNode);
      this.workletNode.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error starting recorder:', error);
      this.stop();
    }
  }

  async stop() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.mediaStreamSource = null;
    this.workletNode = null;
  }
}

export const useRealtime = () => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [audioPlayer] = useState(() => new Player());
  const [audioRecorder, setAudioRecorder] = useState<Recorder | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  const startAudio = useCallback(async () => {
    try {
      const ws = new WebSocket("ws://localhost:8000/ws");
      setWebSocket(ws);

      await audioPlayer.init(24000);

      let buffer = new Uint8Array();

      const appendToBuffer = (newData: Uint8Array) => {
        const newBuffer = new Uint8Array(buffer.length + newData.length);
        newBuffer.set(buffer);
        newBuffer.set(newData, buffer.length);
        buffer = newBuffer;
      };

      const handleAudioData = (data: ArrayBuffer) => {
        const uint8Array = new Uint8Array(data);
        appendToBuffer(uint8Array);

        if (buffer.length >= BUFFER_SIZE) {
          const toSend = new Uint8Array(buffer.slice(0, BUFFER_SIZE));
          buffer = new Uint8Array(buffer.slice(BUFFER_SIZE));

          const regularArray = String.fromCharCode(...toSend);
          const base64 = btoa(regularArray);

          ws.send(JSON.stringify({type: 'input_audio_buffer.append', audio: base64}));
        }
      };

      const recorder = new Recorder(handleAudioData);
      setAudioRecorder(recorder);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await recorder.start(stream);

      setIsAudioOn(true);
    } catch (error) {
      console.error('Error starting audio:', error);
      alert('Error accessing the microphone. Please check your settings and try again.');
    }
  }, [audioPlayer]);

  const stopAudio = useCallback(() => {
    if (audioRecorder) {
      audioRecorder.stop();
    }
    if (webSocket) {
      webSocket.close();
    }
    setIsAudioOn(false);
  }, [audioRecorder, webSocket]);

  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data?.type !== 'response.audio.delta') return;

        const binary = atob(data.delta);
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        const pcmData = new Int16Array(bytes.buffer);

        audioPlayer.play(pcmData);
      };
    }
  }, [webSocket, audioPlayer]);

  return {
    isAudioOn,
    startAudio,
    stopAudio
  };
};
