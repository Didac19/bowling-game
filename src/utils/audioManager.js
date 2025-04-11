// Audio manager for bowling game sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.currentlyPlaying = new Set();
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
            { name: 'strike1', url: '/src/assets/sounds/strike1.mp3' },
            { name: 'strike2', url: '/src/assets/sounds/strike2.mp3' },
            { name: 'spare1', url: '/src/assets/sounds/spare1.mp3' },
            { name: 'gutter_en', url: '/src/assets/sounds/gutter_en.mp3' },
            { name: 'gutter_es', url: '/src/assets/sounds/gutter_es.mp3' },
            { name: 'motiv2', url: '/src/assets/sounds/motiv2.mp3' },
            { name: 'motiv3', url: '/src/assets/sounds/motiv3.mp3' }

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