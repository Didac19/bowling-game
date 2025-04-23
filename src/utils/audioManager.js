// Audio manager for bowling game sound effects
let audioContext;

class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.currentlyPlaying = new Set();
        this.initAudioContext();
    }

    initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
        } catch (error) {
            console.error(`Error loading sound ${name}:`, error);
        }
    }

    async preloadSounds() {
        const soundFiles = [
            { name: 'strike1', url: '/sounds/strike1.mp3' },
            { name: 'strike2', url: '/sounds/strike2.mp3' },
            { name: 'spare1', url: '/sounds/spare1.mp3' },
            { name: 'gutter_en', url: '/sounds/gutter_en.mp3' },
            { name: 'gutter_es', url: '/sounds/gutter_es.mp3' },
            { name: 'motiv2', url: '/sounds/motiv2.mp3' },
            { name: 'motiv3', url: '/sounds/motiv3.mp3' }

        ];

        await Promise.all(soundFiles.map(({ name, url }) => this.loadSound(name, url)));
    }

    playSound(category, delay = 0) {
        let soundName;

        switch (category) {
            case 'strike':
                soundName = Math.random() < 0.5 ? 'strike1' : 'strike2';
                break;
            case 'spare':
                soundName = 'spare1';
                break;
            case 'gutter':
                soundName = Math.random() < 0.5 ? 'gutter_en' : 'gutter_es';
                break;
            case 'regular':
                soundName = Math.random() < 0.5 ? 'motiv2' : 'motiv3';
                console.log('cambio', soundName);
                break;
            default:
                return;
        }

        const audioBuffer = this.sounds.get(soundName);
        if (!audioBuffer || this.currentlyPlaying.has(soundName)) return;

        setTimeout(() => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);

            this.currentlyPlaying.add(soundName);
            source.onended = () => this.currentlyPlaying.delete(soundName);

            source.start();
        }, delay);
    }
}

const audioManager = new AudioManager();
export default audioManager;