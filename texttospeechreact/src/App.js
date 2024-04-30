import React, { useState, useEffect } from 'react';

function SpeechSynthesizer() {
  const [inputText, setInputText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      setVoices(synth.getVoices());
    };

    updateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = updateVoices;
    }

    return () => {
      // Cleanup
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(inputText);
    if (selectedVoice) {
      utterThis.voice = selectedVoice;
    }
    utterThis.pitch = pitch;
    utterThis.rate = rate;
    synth.speak(utterThis);
    utterThis.onpause = (event) => {
      const char = event.utterance.text.charAt(event.charIndex);
      console.log(
        `Speech paused at character ${event.charIndex} of "${event.utterance.text}", which is "${char}".`,
      );
    };
  };

  const handlePitchChange = (event) => {
    setPitch(event.target.value);
  };

  const handleRateChange = (event) => {
    setRate(event.target.value);
  };

  return (
    <div>
      <h1>Speech synthesizer</h1>
      <p>
        Enter some text in the input below and press return to hear it. Change
        voices using the dropdown menu.
      </p>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />
        <div>
          <label htmlFor="rate">Rate</label>
          <input
            type="range"
            min="0.5"
            max="2"
            value={rate}
            step="0.1"
            id="rate"
            onChange={handleRateChange}
          />
          <div className="rate-value">{rate}</div>
          <div className="clearfix"></div>
        </div>
        <div>
          <label htmlFor="pitch">Pitch</label>
          <input
            type="range"
            min="0"
            max="2"
            value={pitch}
            step="0.1"
            id="pitch"
            onChange={handlePitchChange}
          />
          <div className="pitch-value">{pitch}</div>
          <div className="clearfix"></div>
        </div>
        <select
          value={selectedVoice ? selectedVoice.name : ''}
          onChange={(event) =>
            setSelectedVoice(
              voices.find((voice) => voice.name === event.target.value)
            )
          }
        >
          <option value="">Select a voice</option>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {`${voice.name} (${voice.lang})${
                voice.default ? ' — DEFAULT' : ''
              }`}
            </option>
          ))}
        </select>
        <button type="submit">Speak</button>
      </form>
    </div>
  );
}

export default SpeechSynthesizer;
