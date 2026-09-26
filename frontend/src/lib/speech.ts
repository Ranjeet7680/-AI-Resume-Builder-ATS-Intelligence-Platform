// Web Speech API client-side helper for Speech-to-Text and Text-to-Speech

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
  onStart?: () => void;
}

export class SpeechRecognitionManager {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(options: SpeechRecognitionOptions): boolean {
    if (!this.recognition) {
      options.onError("Speech recognition is not supported in this browser.");
      return false;
    }

    try {
      if (this.isListening) {
        this.recognition.abort();
      }

      this.recognition.continuous = options.continuous ?? false;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.lang = options.language || "en-IN";

      this.recognition.onstart = () => {
        this.isListening = true;
        options.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        if (finalTranscript) {
          options.onResult(finalTranscript, true);
        } else if (interimTranscript) {
          options.onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        options.onError(event.error || "Speech recognition error");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        options.onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      options.onError(err.message || "Failed to start speech recognition");
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public abort(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// -----------------------------------------------------------------------------
// Text-to-Speech (TTS) Manager
// -----------------------------------------------------------------------------
export class TextToSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public speak(
    text: string,
    options: {
      language?: string;
      speed?: number;
      voiceIndex?: number;
      onEnd?: () => void;
      onError?: (error: any) => void;
    } = {}
  ): void {
    if (!this.synth) return;

    this.stop(); // Stop any currently playing audio

    // Clean text: strip markdown symbols for pleasant speech
    const cleanText = text
      .replace(/[*#_`~\[\]]/g, "")
      .replace(/https?:\/\/\S+/g, "link")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.speed || 1.0;
    utterance.lang = options.language || "en-IN";

    // Match voice to language if available
    const matchedVoices = this.getVoices().filter((v) =>
      v.lang.toLowerCase().startsWith((options.language || "en").toLowerCase().slice(0, 2))
    );

    if (options.voiceIndex !== undefined && this.voices[options.voiceIndex]) {
      utterance.voice = this.voices[options.voiceIndex];
    } else if (matchedVoices.length > 0) {
      utterance.voice = matchedVoices[0];
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      options.onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  public isPaused(): boolean {
    return this.synth ? this.synth.paused : false;
  }
}

export const speechRecognizer = new SpeechRecognitionManager();
export const textToSpeech = new TextToSpeechManager();
