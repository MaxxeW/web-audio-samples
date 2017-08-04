/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @class PolySynthDemo
 * @description Triggers synthesizer events based on GUI input.
 */
class PolySynthDemo {
  /**
   * @constructor
   * @param {AudioContext} context The audio context.
   */
  constructor(context) {
    this.masterGain_ = new GainNode(context, {gain: 0.5});
    this.polySynth_ = new PolySynth(context);
    this.polySynth_.output.connect(this.masterGain_)
        .connect(context.destination);

    // Initialize a QWERTY keyboard defined in qwerty-hancock.min.js.
    // The key A on a computer keyboard maps onto the note C, and the letters
    // to the right of A (SDFGHJ) map onto the notes above C in a C major scale
    // (DEFGAB). The letters WETYU map onto the black keys of a piano.
    this.keyboard_ = new QwertyHancock(
        {id: 'keyboard', width: 600, height: 150, octaves: 2});

    this.keyboard_.keyDown = this.keyDown.bind(this);
    this.keyboard_.keyUp = this.keyUp.bind(this);
  }

  /**
   * Initialize GUI components.
   * @param {String} containerId The ID of the container element (e.g. <div>).
   */
  initializeGUI(containerId) {
    let lowPassSlider_ = new ParamController(
        containerId, this.polySynth_.setParameter.bind(this.polySynth_), {
          name: 'Cutoff',
          id: 'cutoff',
          type: 'range',
          min: this.polySynth_.lowPassMinCutoff,
          max: this.polySynth_.lowPassMaxCutoff,
          step: 1,
          default: this.polySynth_.lowPassMaxCutoff,
        });

    // The maximum gain is set to be larger than 1 to allow for highly filtered
    // sounds to be audible. It is up to the user to avoid distortion.
    let masterGainSlider_ =
        new ParamController(containerId, this.setGain.bind(this), {
          name: 'Volume',
          id: 'masterGain',
          type: 'range',
          min: 0,
          max: 5,
          step: 0.01,
          default: this.masterGain_.gain.value,
        });
  }

  /**
   * Change the volume.
   * This is bound to an event listener by a ParamController.
   * @param {Number} value The new gain.
   */
  setGain(value) {
    this.masterGain_.gain.value = parseFloat(value);
  }

  /**
   * Play a note when a mapped key is pressed. This method implements a function
   * triggered in qwerty-hancock.min.js.
   * @param {String} noteName The note to be played, e.g. A4 for an octave 4 A.
   * @param {Number} frequency The corresponding pitch of the note, e.g 440.
   */
  keyDown(noteName, frequency) {
    this.polySynth_.playVoice(noteName, frequency);
  }

  /**
   * Release the note. This method implements a function triggered in
   * qwerty-hancock.min.js.
   * @param {String} noteName The note to be played, e.g. A4 for an octave 4 A.
   * @param {Number} frequency The corresponding pitch of the note, e.g 440.
   */
  keyUp(noteName, frequency) {
    this.polySynth_.releaseVoice(noteName, frequency);
  }
}
