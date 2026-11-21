(function () {
  "use strict";

  var SAMPLE_RATE = 44100;

  var WAVEFORMS = [
    { id: "square", label: "Square" },
    { id: "sawtooth", label: "Saw" },
    { id: "triangle", label: "Tri" },
    { id: "sine", label: "Sine" },
    { id: "white", label: "Noise" },
    { id: "pink", label: "Pink" },
    { id: "fm", label: "FM Bell" }
  ];

  var PARAM_GROUPS = [
    {
      id: "envelope",
      title: "Envelope",
      fields: [
        { key: "attack", label: "Attack", min: 0, max: 0.25, step: 0.002, unit: "s" },
        { key: "sustain", label: "Sustain", min: 0.01, max: 0.75, step: 0.005, unit: "s" },
        { key: "punch", label: "Punch", min: 0, max: 1.0, step: 0.02, unit: "" },
        { key: "decay", label: "Decay", min: 0.02, max: 1.1, step: 0.005, unit: "s" }
      ]
    },
    {
      id: "pitch",
      title: "Pitch & Modulation",
      fields: [
        { key: "startFreq", label: "Start Freq", min: 45, max: 2600, step: 5, unit: "Hz" },
        { key: "slide", label: "Slide", min: -2.0, max: 2.0, step: 0.02, unit: "" },
        { key: "deltaSlide", label: "Delta Slide", min: -2.0, max: 2.0, step: 0.02, unit: "" },
        { key: "vibratoDepth", label: "Vib Depth", min: 0, max: 0.4, step: 0.01, unit: "" },
        { key: "vibratoSpeed", label: "Vib Speed", min: 0, max: 55, step: 0.5, unit: "Hz" },
        { key: "arpJump", label: "Arp Jump", min: -12, max: 14, step: 1, unit: "st" }
      ]
    },
    {
      id: "tone",
      title: "Tone & FX",
      fields: [
        { key: "lpCutoff", label: "Lowpass", min: 250, max: 18000, step: 50, unit: "Hz" },
        { key: "hpCutoff", label: "Highpass", min: 20, max: 3200, step: 20, unit: "Hz" },
        { key: "bitcrush", label: "Bitcrush", min: 0, max: 0.95, step: 0.02, unit: "" },
        { key: "duty", label: "Duty Cycle", min: 0.08, max: 0.92, step: 0.02, unit: "" },
        { key: "echo", label: "Room Echo", min: 0, max: 0.65, step: 0.02, unit: "" },
        { key: "gain", label: "Master Gain", min: 0.15, max: 1.0, step: 0.02, unit: "" }
      ]
    }
  ];

  var DEFAULT_PARAMS = {
    wave: "square",
    attack: 0.0,
    sustain: 0.08,
    punch: 0.45,
    decay: 0.22,
    startFreq: 680,
    slide: 0.0,
    deltaSlide: 0.0,
    vibratoDepth: 0.0,
    vibratoSpeed: 0.0,
    arpJump: 0,
    lpCutoff: 14000,
    hpCutoff: 40,
    bitcrush: 0.0,
    duty: 0.5,
    echo: 0.08,
    gain: 0.8,
    seed: 104729
  };

  var PRESETS = [
    {
      id: "coin",
      name: "Coin / Pickup",
      cat: "game",
      tag: "Arcade",
      slug: "coin_pickup",
      params: {
        wave: "square", attack: 0.0, sustain: 0.07, punch: 0.55, decay: 0.24,
        startFreq: 988, slide: 0.0, deltaSlide: 0.0, vibratoDepth: 0.0, vibratoSpeed: 0,
        arpJump: 5, lpCutoff: 12000, hpCutoff: 120, bitcrush: 0.0, duty: 0.48, echo: 0.14, gain: 0.82
      }
    },
    {
      id: "jump",
      name: "Jump / Hop",
      cat: "game",
      tag: "Arcade",
      slug: "jump_hop",
      params: {
        wave: "square", attack: 0.0, sustain: 0.09, punch: 0.25, decay: 0.18,
        startFreq: 260, slide: 1.35, deltaSlide: -0.25, vibratoDepth: 0.0, vibratoSpeed: 0,
        arpJump: 0, lpCutoff: 9500, hpCutoff: 90, bitcrush: 0.08, duty: 0.36, echo: 0.06, gain: 0.8
      }
    },
    {
      id: "laser",
      name: "Laser / Pew",
      cat: "game",
      tag: "Sci-Fi",
      slug: "laser_pew",
      params: {
        wave: "sawtooth", attack: 0.0, sustain: 0.06, punch: 0.4, decay: 0.2,
        startFreq: 1350, slide: -1.65, deltaSlide: -0.45, vibratoDepth: 0.03, vibratoSpeed: 28,
        arpJump: 0, lpCutoff: 11000, hpCutoff: 160, bitcrush: 0.14, duty: 0.5, echo: 0.12, gain: 0.8
      }
    },
    {
      id: "hit",
      name: "Hit / Hurt",
      cat: "game",
      tag: "Combat",
      slug: "hit_hurt",
      params: {
        wave: "sawtooth", attack: 0.0, sustain: 0.04, punch: 0.7, decay: 0.14,
        startFreq: 340, slide: -1.3, deltaSlide: -0.3, vibratoDepth: 0.0, vibratoSpeed: 0,
        arpJump: 0, lpCutoff: 4200, hpCutoff: 80, bitcrush: 0.45, duty: 0.5, echo: 0.05, gain: 0.85
      }
    },
    {
      id: "explosion",
      name: "Explosion / Boom",
      cat: "game",
      tag: "Impact",
      slug: "explosion_boom",
      params: {
        wave: "pink", attack: 0.004, sustain: 0.12, punch: 0.85, decay: 0.55,
        startFreq: 160, slide: -0.8, deltaSlide: 0.0, vibratoDepth: 0.08, vibratoSpeed: 12,
        arpJump: 0, lpCutoff: 2400, hpCutoff: 35, bitcrush: 0.55, duty: 0.5, echo: 0.25, gain: 0.9
      }
    },
    {
      id: "powerup",
      name: "Powerup / Level Up",
      cat: "game",
      tag: "Reward",
      slug: "powerup_level",
      params: {
        wave: "triangle", attack: 0.004, sustain: 0.16, punch: 0.35, decay: 0.34,
        startFreq: 440, slide: 0.72, deltaSlide: 0.25, vibratoDepth: 0.05, vibratoSpeed: 18,
        arpJump: 7, lpCutoff: 13500, hpCutoff: 110, bitcrush: 0.0, duty: 0.5, echo: 0.22, gain: 0.85
      }
    },
    {
      id: "ui_click",
      name: "UI Click (Crisp)",
      cat: "ui",
      tag: "Modern UI",
      slug: "ui_click_crisp",
      params: {
        wave: "triangle", attack: 0.0, sustain: 0.012, punch: 0.65, decay: 0.036,
        startFreq: 1450, slide: -1.15, deltaSlide: 0.0, vibratoDepth: 0.0, vibratoSpeed: 0,
        arpJump: 0, lpCutoff: 7800, hpCutoff: 420, bitcrush: 0.0, duty: 0.5, echo: 0.02, gain: 0.78
      }
    },
    {
      id: "ui_hover",
      name: "UI Hover (Soft)",
      cat: "ui",
      tag: "Modern UI",
      slug: "ui_hover_soft",
      params: {
        wave: "sine", attack: 0.004, sustain: 0.015, punch: 0.2, decay: 0.045,
        startFreq: 760, slide: 0.35, deltaSlide: 0.0, vibratoDepth: 0.0, vibratoSpeed: 0,
        arpJump: 0, lpCutoff: 4500, hpCutoff: 280, bitcrush: 0.0, duty: 0.5, echo: 0.05, gain: 0.68
      }
    },
    {
      id: "ui_confirm",
      name: "UI Confirm / Chime",
      cat: "ui",
      tag: "Glass FM",
      slug: "ui_confirm_chime",
      params: {
        wave: "fm", attack: 0.002, sustain: 0.08, punch: 0.35, decay: 0.32,
        startFreq: 660, slide: 0.0, deltaSlide: 0.0, vibratoDepth: 0.0, vibratoSpeed: 0,
        arpJump: 7, lpCutoff: 15000, hpCutoff: 180, bitcrush: 0.0, duty: 0.5, echo: 0.24, gain: 0.8
      }
    },
    {
      id: "ui_error",
      name: "UI Error / Buzz",
      cat: "ui",
      tag: "Alert",
      slug: "ui_error_buzz",
      params: {
        wave: "sawtooth", attack: 0.002, sustain: 0.08, punch: 0.45, decay: 0.16,
        startFreq: 210, slide: -0.25, deltaSlide: 0.0, vibratoDepth: 0.06, vibratoSpeed: 32,
        arpJump: -4, lpCutoff: 2600, hpCutoff: 80, bitcrush: 0.22, duty: 0.5, echo: 0.06, gain: 0.8
      }
    },
    {
      id: "swoosh",
      name: "Swoosh / Transition",
      cat: "ui",
      tag: "Creator",
      slug: "swoosh_transition",
      params: {
        wave: "pink", attack: 0.06, sustain: 0.09, punch: 0.2, decay: 0.26,
        startFreq: 520, slide: 0.9, deltaSlide: -1.1, vibratoDepth: 0.0, vibratoSpeed: 0,
        arpJump: 0, lpCutoff: 5800, hpCutoff: 220, bitcrush: 0.0, duty: 0.5, echo: 0.22, gain: 0.85
      }
    },
    {
      id: "magic",
      name: "Magic / Sparkle",
      cat: "ui",
      tag: "Creator",
      slug: "magic_sparkle",
      params: {
        wave: "fm", attack: 0.01, sustain: 0.16, punch: 0.3, decay: 0.48,
        startFreq: 880, slide: 0.42, deltaSlide: 0.15, vibratoDepth: 0.11, vibratoSpeed: 24,
        arpJump: 12, lpCutoff: 16500, hpCutoff: 260, bitcrush: 0.0, duty: 0.5, echo: 0.36, gain: 0.8
      }
    }
  ];

  // Deterministic PRNG (Mulberry32)
  function createRng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  // Synthesize deterministic Float32Array PCM at 44100 Hz
  function synthesizeBuffer(rawParams) {
    var p = Object.assign({}, DEFAULT_PARAMS, rawParams || {});
    var rng = createRng(p.seed || 104729);

    var atkSamples = Math.max(0, Math.round(p.attack * SAMPLE_RATE));
    var susSamples = Math.max(1, Math.round(p.sustain * SAMPLE_RATE));
    var decSamples = Math.max(1, Math.round(p.decay * SAMPLE_RATE));
    var coreLen = atkSamples + susSamples + decSamples;
    var echoDelaySamples = Math.round(0.055 * SAMPLE_RATE);
    var echoTail = p.echo > 0.01 ? Math.round(SAMPLE_RATE * (0.12 + p.echo * 0.42)) : 0;
    var totalLen = Math.min(SAMPLE_RATE * 3, Math.max(256, coreLen + echoTail));

    var out = new Float32Array(totalLen);

    var freq = clamp(p.startFreq, 30, 8000);
    var slideMulPerSample = Math.pow(2, p.slide / SAMPLE_RATE);
    var deltaSlidePerSample = p.deltaSlide / (SAMPLE_RATE * SAMPLE_RATE);
    var arpSample = Math.round(coreLen * 0.34);
    var arpRatio = p.arpJump !== 0 ? Math.pow(2, p.arpJump / 12) : 1.0;
    var arpApplied = false;

    var phase = 0;
    var vibPhase = 0;

    // Pink noise state (Paul Kellet)
    var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    var noiseHold = 0;
    var noiseCounter = 0;

    // 1-pole filters
    var lpAlpha = clamp((2 * Math.PI * clamp(p.lpCutoff, 120, 20000)) / (SAMPLE_RATE + 2 * Math.PI * clamp(p.lpCutoff, 120, 20000)), 0.01, 0.99);
    var hpRc = 1 / (2 * Math.PI * clamp(p.hpCutoff, 10, 8000));
    var dt = 1 / SAMPLE_RATE;
    var hpAlpha = hpRc / (hpRc + dt);
    var lpState = 0;
    var hpPrevIn = 0;
    var hpState = 0;

    // Bitcrush state
    var crushStep = Math.max(1, Math.round(1 + p.bitcrush * 24));
    var crushHold = 0;
    var quantLevels = p.bitcrush > 0.01 ? Math.max(4, Math.round(64 * (1 - p.bitcrush * 0.88))) : 0;

    var oversample = (p.wave === "square" || p.wave === "sawtooth") ? 2 : 1;
    var invOversample = 1 / oversample;

    for (var i = 0; i < totalLen; i++) {
      var env = 0;
      if (i < atkSamples) {
        env = atkSamples > 0 ? i / atkSamples : 1;
      } else if (i < atkSamples + susSamples) {
        var susPos = (i - atkSamples) / susSamples;
        env = 1 + (1 - susPos) * p.punch * 0.7;
      } else if (i < coreLen) {
        var decPos = (i - atkSamples - susSamples) / decSamples;
        env = Math.pow(Math.max(0, 1 - decPos), 1.65);
      } else {
        env = 0;
      }

      if (!arpApplied && p.arpJump !== 0 && i >= arpSample) {
        freq = clamp(freq * arpRatio, 30, 10000);
        arpApplied = true;
      }

      slideMulPerSample += deltaSlidePerSample;
      freq = clamp(freq * slideMulPerSample, 25, 11000);

      var instFreq = freq;
      if (p.vibratoDepth > 0 && p.vibratoSpeed > 0) {
        vibPhase += (2 * Math.PI * p.vibratoSpeed) / SAMPLE_RATE;
        instFreq *= 1 + Math.sin(vibPhase) * p.vibratoDepth;
      }

      var sample = 0;
      if (i < coreLen) {
        if (p.wave === "white" || p.wave === "pink") {
          var stepPeriod = Math.max(1, Math.round(2400 / Math.max(80, instFreq)));
          if (noiseCounter <= 0) {
            var white = rng() * 2 - 1;
            if (p.wave === "pink") {
              b0 = 0.99886 * b0 + white * 0.0555179;
              b1 = 0.99332 * b1 + white * 0.0750759;
              b2 = 0.96900 * b2 + white * 0.1538520;
              b3 = 0.86650 * b3 + white * 0.3104856;
              b4 = 0.55000 * b4 + white * 0.5329522;
              b5 = -0.7616 * b5 - white * 0.0168980;
              noiseHold = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.16;
              b6 = white * 0.115926;
            } else {
              noiseHold = white * 0.72;
            }
            noiseCounter = stepPeriod;
          }
          noiseCounter--;
          sample = noiseHold;
        } else {
          var subAcc = 0;
          var phaseInc = (instFreq / SAMPLE_RATE) * invOversample;
          for (var os = 0; os < oversample; os++) {
            phase += phaseInc;
            phase -= Math.floor(phase);
            if (p.wave === "square") {
              subAcc += phase < p.duty ? 1.0 : -1.0;
            } else if (p.wave === "sawtooth") {
              subAcc += 2.0 * phase - 1.0;
            } else if (p.wave === "triangle") {
              subAcc += 1.0 - 4.0 * Math.abs(Math.round(phase - 0.25) - (phase - 0.25));
            } else if (p.wave === "sine") {
              subAcc += Math.sin(2 * Math.PI * phase);
            } else if (p.wave === "fm") {
              var modEnv = Math.exp((-i / SAMPLE_RATE) * 9.5);
              var mod = Math.sin(2 * Math.PI * phase * 2.41) * (1.85 * modEnv + 0.15);
              subAcc += Math.sin(2 * Math.PI * phase + mod);
            }
          }
          sample = subAcc * invOversample;
        }
        sample *= env;
      }

      // Bitcrush
      if (p.bitcrush > 0.01) {
        if (i % crushStep === 0) {
          crushHold = quantLevels > 0 ? Math.round(sample * quantLevels) / quantLevels : sample;
        }
        sample = crushHold;
      }

      // Lowpass + Highpass
      lpState = lpState + lpAlpha * (sample - lpState);
      var lpOut = lpState;
      hpState = hpAlpha * (hpState + lpOut - hpPrevIn);
      hpPrevIn = lpOut;
      var filtered = hpState;

      // Room echo tap
      if (p.echo > 0.01 && i >= echoDelaySamples) {
        filtered += out[i - echoDelaySamples] * (p.echo * 0.62);
      }

      out[i] = filtered;
    }

    // Apply master gain, soft ceiling, and tail de-click fade
    var maxAbs = 0;
    var fadeTail = Math.min(220, Math.floor(totalLen * 0.15));
    for (var j = 0; j < totalLen; j++) {
      var s = Math.tanh(out[j] * p.gain * 1.15);
      if (j >= totalLen - fadeTail) {
        s *= (totalLen - j) / fadeTail;
      }
      out[j] = s;
      var a = Math.abs(s);
      if (a > maxAbs) maxAbs = a;
    }

    // Trim long near-silent tail beyond coreLen if echo decayed early
    var trimEnd = totalLen;
    while (trimEnd > Math.min(coreLen, totalLen) && Math.abs(out[trimEnd - 1]) < 0.0008) {
      trimEnd--;
    }
    trimEnd = Math.min(totalLen, Math.max(256, trimEnd + 180));
    var finalBuf = trimEnd < totalLen ? out.subarray(0, trimEnd) : out;

    // Metrics
    var peak = 0;
    var sumSq = 0;
    var activeCount = 0;
    for (var k = 0; k < finalBuf.length; k++) {
      var v = finalBuf[k];
      var av = Math.abs(v);
      if (av > peak) peak = av;
      if (av > 0.004) {
        sumSq += v * v;
        activeCount++;
      }
    }
    var rms = activeCount > 0 ? Math.sqrt(sumSq / activeCount) : 0;
    var peakDb = peak > 0 ? 20 * Math.log10(peak) : -96.0;
    var approxLufs = rms > 0 ? Math.max(-70, 20 * Math.log10(rms) - 0.691) : -70.0;
    var durationMs = Math.round((finalBuf.length / SAMPLE_RATE) * 1000);

    return {
      samples: finalBuf,
      sampleRate: SAMPLE_RATE,
      durationMs: durationMs,
      peak: peak,
      peakDb: peakDb,
      approxLufs: approxLufs
    };
  }

  // Lightweight DFT spectrum for OLED visualizer (48 log-ish frequency bins)
  function computeSpectrumBins(samples, binCount) {
    var bins = new Float32Array(binCount);
    if (!samples || samples.length === 0) return bins;
    var N = Math.min(1024, samples.length);
    var startIdx = 0;
    // Find loudest window so crisp transients still show spectrum cleanly
    var bestEnergy = -1;
    for (var off = 0; off + N <= samples.length; off += 256) {
      var e = 0;
      for (var t = 0; t < N; t += 8) {
        var val = samples[off + t];
        e += val * val;
      }
      if (e > bestEnergy) {
        bestEnergy = e;
        startIdx = off;
      }
    }
    for (var b = 0; b < binCount; b++) {
      var frac = b / (binCount - 1);
      var targetFreq = 80 * Math.pow(14000 / 80, frac);
      var k = (targetFreq * N) / SAMPLE_RATE;
      var re = 0;
      var im = 0;
      var twoPiKOverN = (2 * Math.PI * k) / N;
      for (var n = 0; n < N; n += 2) {
        var win = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1));
        var s = samples[startIdx + n] * win;
        var ang = twoPiKOverN * n;
        re += s * Math.cos(ang);
        im -= s * Math.sin(ang);
      }
      var mag = Math.sqrt(re * re + im * im) / (N * 0.25);
      var db = mag > 0.0001 ? clamp((20 * Math.log10(mag) + 54) / 54, 0, 1) : 0;
      bins[b] = db;
    }
    return bins;
  }

  // 16-bit PCM WAV Encoder
  function encodeWavBytes(samples, sampleRate) {
    var dataLen = samples.length * 2;
    var buf = new ArrayBuffer(44 + dataLen);
    var view = new DataView(buf);

    function writeStr(offset, str) {
      for (var i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }

    writeStr(0, "RIFF");
    view.setUint32(4, 36 + dataLen, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, dataLen, true);

    var offset = 44;
    for (var i = 0; i < samples.length; i++) {
      var s = clamp(samples[i], -1, 1);
      view.setInt16(offset, s < 0 ? Math.round(s * 32768) : Math.round(s * 32767), true);
      offset += 2;
    }
    return new Uint8Array(buf);
  }

  // Pure-JS CRC32 + STORE ZIP writer
  var CRC_TABLE = (function () {
    var table = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(u8) {
    var c = 0xffffffff;
    for (var i = 0; i < u8.length; i++) {
      c = CRC_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function encodeTextUtf8(str) {
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(str);
    }
    var arr = [];
    for (var i = 0; i < str.length; i++) {
      arr.push(str.charCodeAt(i) & 0xff);
    }
    return new Uint8Array(arr);
  }

  function buildStoreZip(entries) {
    var localParts = [];
    var centralParts = [];
    var offset = 0;

    for (var i = 0; i < entries.length; i++) {
      var ent = entries[i];
      var nameBytes = encodeTextUtf8(ent.name);
      var dataBytes = ent.data instanceof Uint8Array ? ent.data : encodeTextUtf8(String(ent.data));
      var crc = crc32(dataBytes);
      var len = dataBytes.length;

      var localHdr = new Uint8Array(30 + nameBytes.length);
      var lv = new DataView(localHdr.buffer);
      lv.setUint32(0, 0x04034b50, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(6, 0x0800, true); // UTF-8 filename flag
      lv.setUint16(8, 0, true); // STORE
      lv.setUint16(10, 0, true);
      lv.setUint16(12, 0x5421, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, len, true);
      lv.setUint32(22, len, true);
      lv.setUint16(26, nameBytes.length, true);
      lv.setUint16(28, 0, true);
      localHdr.set(nameBytes, 30);

      localParts.push(localHdr, dataBytes);

      var centralHdr = new Uint8Array(46 + nameBytes.length);
      var cv = new DataView(centralHdr.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0x5421, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, len, true);
      cv.setUint32(24, len, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      centralHdr.set(nameBytes, 46);

      centralParts.push(centralHdr);
      offset += localHdr.length + len;
    }

    var centralSize = 0;
    for (var c = 0; c < centralParts.length; c++) {
      centralSize += centralParts[c].length;
    }

    var eocd = new Uint8Array(22);
    var ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    var totalBytes = offset + centralSize + eocd.length;
    var out = new Uint8Array(totalBytes);
    var pos = 0;
    for (var lp = 0; lp < localParts.length; lp++) {
      out.set(localParts[lp], pos);
      pos += localParts[lp].length;
    }
    for (var cp = 0; cp < centralParts.length; cp++) {
      out.set(centralParts[cp], pos);
      pos += centralParts[cp].length;
    }
    out.set(eocd, pos);
    return out;
  }

  var CC0_LICENSE_TEXT = [
    "CC0 1.0 Universal (Public Domain Dedication) — Each-Touch Forge SFX Pack",
    "",
    "All sound effects included in this archive were procedurally synthesized",
    "via deterministic mathematical DSP algorithms inside SFX Forge (zero generative AI).",
    "To the extent possible under law, Each-Touch Forge waives all copyright and",
    "related or neighboring rights to these exported WAV sound files.",
    "",
    "You can copy, modify, distribute, and use these SFX in free or commercial games,",
    "videos, streams, apps, and hardware projects with no attribution required.",
    "Source: https://each-touch.github.io/forge-tools/sfx-forge/"
  ].join("\n");

  // Application State
  var state = {
    activePresetId: "coin",
    activePresetCatFilter: "all",
    activeRackTab: "all",
    autoPlay: true,
    params: Object.assign({}, DEFAULT_PARAMS, PRESETS[0].params, { seed: 104729 }),
    history: [],
    historyCursor: -1,
    lastRender: null,
    audioCtx: null
  };

  function getAudioCtx() {
    if (!state.audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        state.audioCtx = new Ctx();
      }
    }
    if (state.audioCtx && state.audioCtx.state === "suspended") {
      try {
        state.audioCtx.resume();
      } catch (e) {
        // ignore autoplay suspension errors during automated runs
      }
    }
    return state.audioCtx;
  }

  function playCurrentBuffer(render) {
    var ctx = getAudioCtx();
    if (!ctx || !render || !render.samples.length) return;
    try {
      var ab = ctx.createBuffer(1, render.samples.length, render.sampleRate);
      ab.getChannelData(0).set(render.samples);
      var src = ctx.createBufferSource();
      src.buffer = ab;
      src.connect(ctx.destination);
      src.start();
    } catch (e) {
      // headless audio device may be absent; synthesis remains intact
    }
  }

  function drawScope(render) {
    var canvas = document.getElementById("scope-canvas");
    if (!canvas) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var rect = canvas.getBoundingClientRect();
    var cssW = Math.max(260, Math.round(rect.width || 560));
    var cssH = Math.max(160, Math.round(rect.height || 208));
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
    }
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(dpr, dpr);

    // Background & grid
    ctx.fillStyle = "#05080c";
    ctx.fillRect(0, 0, cssW, cssH);

    var waveTop = 10;
    var waveH = Math.round(cssH * 0.56);
    var waveMid = waveTop + waveH / 2;
    var specTop = waveTop + waveH + 14;
    var specH = cssH - specTop - 10;

    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.lineWidth = 1;
    for (var gx = 1; gx < 8; gx++) {
      var x = (cssW * gx) / 8;
      ctx.beginPath();
      ctx.moveTo(x, 6);
      ctx.lineTo(x, cssH - 6);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, waveMid);
    ctx.lineTo(cssW, waveMid);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, specTop - 6);
    ctx.lineTo(cssW, specTop - 6);
    ctx.stroke();

    // Waveform trace
    var samples = render.samples;
    if (samples && samples.length > 0) {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      var step = Math.max(1, Math.floor(samples.length / cssW));
      for (var px = 0; px < cssW; px++) {
        var idxStart = Math.min(samples.length - 1, Math.floor((px / cssW) * samples.length));
        var idxEnd = Math.min(samples.length, idxStart + step);
        var minV = 1, maxV = -1;
        for (var s = idxStart; s < idxEnd; s++) {
          var sv = samples[s];
          if (sv < minV) minV = sv;
          if (sv > maxV) maxV = sv;
        }
        var yTop = waveMid - maxV * (waveH * 0.45);
        var yBot = waveMid - minV * (waveH * 0.45);
        if (px === 0) {
          ctx.moveTo(px, yTop);
        } else {
          ctx.lineTo(px, yTop);
        }
        ctx.lineTo(px, yBot);
      }
      ctx.stroke();

      // Spectrum bars
      var binCount = 44;
      var bins = computeSpectrumBins(samples, binCount);
      var barSlot = (cssW - 16) / binCount;
      var barW = Math.max(2, barSlot - 2);
      for (var b = 0; b < binCount; b++) {
        var bh = Math.max(2, bins[b] * specH);
        var bx = 8 + b * barSlot;
        var by = specTop + specH - bh;
        ctx.fillStyle = b > 30 ? "#f59e0b" : "#38bdf8";
        ctx.globalAlpha = 0.25 + bins[b] * 0.72;
        ctx.fillRect(bx, by, barW, bh);
      }
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "rgba(186, 200, 218, 0.88)";
    ctx.font = "10px ui-monospace, Menlo, monospace";
    ctx.fillText("WAVEFORM", 8, 16);
    ctx.fillText("SPECTRUM (80Hz - 14kHz)", 8, specTop + 8);
    ctx.restore();
  }

  function formatParamValue(field, val) {
    if (field.unit === "Hz") return Math.round(val) + " Hz";
    if (field.unit === "s") return Number(val).toFixed(3) + " s";
    if (field.unit === "st") return (val > 0 ? "+" : "") + Math.round(val) + " st";
    return Number(val).toFixed(2);
  }

  function syncUiFromState() {
    // Active waveform pill
    document.querySelectorAll(".wave-pill").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-wave") === state.params.wave);
    });

    // Active preset button
    document.querySelectorAll(".preset-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-preset") === state.activePresetId);
    });

    // Sliders
    PARAM_GROUPS.forEach(function (g) {
      g.fields.forEach(function (f) {
        var input = document.getElementById("param-" + f.key);
        var valEl = document.getElementById("val-" + f.key);
        if (input) input.value = String(state.params[f.key]);
        if (valEl) valEl.textContent = formatParamValue(f, state.params[f.key]);
      });
    });

    // Render and update HUD
    var render = synthesizeBuffer(state.params);
    state.lastRender = render;
    drawScope(render);

    var presetObj = PRESETS.find(function (x) { return x.id === state.activePresetId; });
    var nameEl = document.getElementById("hud-name");
    var durEl = document.getElementById("hud-dur");
    var peakEl = document.getElementById("hud-peak");
    var lufsEl = document.getElementById("hud-lufs");
    var seedEl = document.getElementById("hud-seed");
    if (nameEl) nameEl.textContent = presetObj ? presetObj.name : "Custom Synth";
    if (durEl) durEl.textContent = render.durationMs + " ms";
    if (peakEl) peakEl.textContent = render.peakDb.toFixed(1) + " dBFS";
    if (lufsEl) lufsEl.textContent = render.approxLufs.toFixed(1) + " LUFS";
    if (seedEl) seedEl.textContent = "#" + state.params.seed;

    window.__SFX_FORGE_STATE__ = {
      activePresetId: state.activePresetId,
      wave: state.params.wave,
      seed: state.params.seed,
      durationMs: render.durationMs,
      peak: render.peak,
      peakDb: render.peakDb,
      approxLufs: render.approxLufs,
      sampleCount: render.samples.length,
      historyCount: state.history.length
    };
    return render;
  }

  function pushHistory(label) {
    var snap = {
      label: label,
      presetId: state.activePresetId,
      params: Object.assign({}, state.params)
    };
    state.history.unshift(snap);
    if (state.history.length > 12) {
      state.history.length = 12;
    }
    state.historyCursor = 0;
    renderHistoryList();
  }

  function renderHistoryList() {
    var list = document.getElementById("history-list");
    if (!list) return;
    list.innerHTML = "";
    state.history.forEach(function (item, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "history-item" + (idx === state.historyCursor ? " active" : "");
      btn.innerHTML =
        "<span>" + item.label + "</span>" +
        '<span class="history-item-meta mono">#' + item.params.seed + "</span>";
      btn.addEventListener("click", function () {
        state.activePresetId = item.presetId;
        state.params = Object.assign({}, item.params);
        state.historyCursor = idx;
        renderHistoryList();
        var r = syncUiFromState();
        playCurrentBuffer(r);
      });
      list.appendChild(btn);
    });
  }

  function setStatus(msg) {
    var el = document.getElementById("export-status");
    if (el) el.textContent = msg;
  }

  function triggerDownload(bytes, filename, mime) {
    var blob = new Blob([bytes], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
  }

  function buildMutatedParams(baseParams, rng, intensity) {
    var next = Object.assign({}, baseParams);
    var jit = function (v, pct, lo, hi) {
      var delta = (rng() * 2 - 1) * pct;
      return clamp(v * (1 + delta), lo, hi);
    };
    next.startFreq = Math.round(jit(baseParams.startFreq, 0.16 * intensity, 45, 2600));
    next.sustain = Number(jit(Math.max(0.012, baseParams.sustain), 0.18 * intensity, 0.01, 0.75).toFixed(3));
    next.decay = Number(jit(baseParams.decay, 0.18 * intensity, 0.02, 1.1).toFixed(3));
    next.punch = Number(clamp(baseParams.punch + (rng() * 2 - 1) * 0.14 * intensity, 0, 1).toFixed(2));
    next.slide = Number(clamp(baseParams.slide + (rng() * 2 - 1) * 0.25 * intensity, -2, 2).toFixed(2));
    next.duty = Number(clamp(baseParams.duty + (rng() * 2 - 1) * 0.12 * intensity, 0.08, 0.92).toFixed(2));
    next.lpCutoff = Math.round(jit(baseParams.lpCutoff, 0.15 * intensity, 350, 18000));
    next.seed = Math.floor(rng() * 899999 + 100000);
    return next;
  }

  function applyPreset(presetId, shouldPlay) {
    var preset = PRESETS.find(function (p) { return p.id === presetId; }) || PRESETS[0];
    state.activePresetId = preset.id;
    state.params = Object.assign({}, DEFAULT_PARAMS, preset.params, {
      seed: Math.floor(Math.random() * 899999 + 100000)
    });
    pushHistory(preset.name);
    var r = syncUiFromState();
    if (shouldPlay) playCurrentBuffer(r);
  }

  function mutateCurrent(shouldPlay) {
    var rng = createRng((Date.now() ^ (state.params.seed * 31)) >>> 0);
    state.params = buildMutatedParams(state.params, rng, 1.0);
    var pObj = PRESETS.find(function (p) { return p.id === state.activePresetId; });
    pushHistory((pObj ? pObj.name : "Custom") + " (Mut)");
    var r = syncUiFromState();
    if (shouldPlay) playCurrentBuffer(r);
  }

  function randomizeAll(shouldPlay) {
    var rng = createRng((Date.now() ^ (Math.random() * 1e9)) >>> 0);
    var waveChoices = ["square", "sawtooth", "triangle", "sine", "pink", "fm"];
    var w = waveChoices[Math.floor(rng() * waveChoices.length)];
    state.activePresetId = "custom";
    state.params = {
      wave: w,
      attack: rng() < 0.25 ? Number((rng() * 0.06).toFixed(3)) : 0,
      sustain: Number((0.02 + rng() * 0.22).toFixed(3)),
      punch: Number((rng() * 0.85).toFixed(2)),
      decay: Number((0.05 + rng() * 0.45).toFixed(3)),
      startFreq: Math.round(110 + rng() * 1650),
      slide: Number(((rng() * 2 - 1) * 1.6).toFixed(2)),
      deltaSlide: Number(((rng() * 2 - 1) * 0.6).toFixed(2)),
      vibratoDepth: rng() < 0.35 ? Number((rng() * 0.14).toFixed(2)) : 0,
      vibratoSpeed: rng() < 0.35 ? Math.round(8 + rng() * 34) : 0,
      arpJump: rng() < 0.4 ? Math.round((rng() * 2 - 1) * 10) : 0,
      lpCutoff: Math.round(1800 + rng() * 14000),
      hpCutoff: Math.round(30 + rng() * 320),
      bitcrush: rng() < 0.35 ? Number((rng() * 0.45).toFixed(2)) : 0,
      duty: Number((0.18 + rng() * 0.64).toFixed(2)),
      echo: Number((rng() * 0.28).toFixed(2)),
      gain: 0.82,
      seed: Math.floor(rng() * 899999 + 100000)
    };
    pushHistory("Random (" + w + ")");
    var r = syncUiFromState();
    if (shouldPlay) playCurrentBuffer(r);
  }

  function downloadSingleWav() {
    var render = state.lastRender || synthesizeBuffer(state.params);
    var wav = encodeWavBytes(render.samples, render.sampleRate);
    var presetObj = PRESETS.find(function (p) { return p.id === state.activePresetId; });
    var base = presetObj ? presetObj.slug : "custom_sfx";
    var fname = base + "_" + state.params.seed + ".wav";
    triggerDownload(wav, fname, "audio/wav");
    setStatus("Exported " + fname + " (" + (wav.length / 1024).toFixed(1) + " KB, 16-bit 44.1kHz)");
  }

  function download8VariationsZip() {
    var presetObj = PRESETS.find(function (p) { return p.id === state.activePresetId; });
    var base = presetObj ? presetObj.slug : "custom_sfx";
    var rng = createRng(state.params.seed ^ 0x9e3779b9);
    var entries = [];
    var manifestItems = [];

    for (var i = 1; i <= 8; i++) {
      var p = i === 1 ? Object.assign({}, state.params) : buildMutatedParams(state.params, rng, 1.0);
      var r = synthesizeBuffer(p);
      var wav = encodeWavBytes(r.samples, r.sampleRate);
      var fn = "wav/" + base + "_v0" + i + ".wav";
      entries.push({ name: fn, data: wav });
      manifestItems.push({ file: fn, durationMs: r.durationMs, peakDb: Number(r.peakDb.toFixed(1)), params: p });
    }
    entries.push({ name: "LICENSE-CC0.txt", data: CC0_LICENSE_TEXT });
    entries.push({
      name: "manifest.json",
      data: JSON.stringify({ generator: "Each-Touch Forge SFX Forge v1.0", license: "CC0-1.0", sampleRate: SAMPLE_RATE, bitDepth: 16, files: manifestItems }, null, 2)
    });

    var zipBytes = buildStoreZip(entries);
    var zipName = base + "_8x_variations_cc0.zip";
    triggerDownload(zipBytes, zipName, "application/zip");
    setStatus("Exported " + zipName + " (8 WAVs + CC0 License, " + (zipBytes.length / 1024).toFixed(1) + " KB)");
  }

  function downloadStarterPackZip() {
    var entries = [];
    var manifestItems = [];
    for (var i = 0; i < PRESETS.length; i++) {
      var pr = PRESETS[i];
      var p = Object.assign({}, DEFAULT_PARAMS, pr.params, { seed: 202600 + i * 7919 });
      var r = synthesizeBuffer(p);
      var wav = encodeWavBytes(r.samples, r.sampleRate);
      var fn = "wav/" + String(i + 1).padStart(2, "0") + "_" + pr.slug + ".wav";
      entries.push({ name: fn, data: wav });
      manifestItems.push({ name: pr.name, category: pr.cat, file: fn, durationMs: r.durationMs, peakDb: Number(r.peakDb.toFixed(1)), params: p });
    }
    entries.push({ name: "LICENSE-CC0.txt", data: CC0_LICENSE_TEXT });
    entries.push({
      name: "manifest.json",
      data: JSON.stringify({ generator: "Each-Touch Forge SFX Forge v1.0", pack: "12-SFX Starter Pack", license: "CC0-1.0", sampleRate: SAMPLE_RATE, bitDepth: 16, files: manifestItems }, null, 2)
    });

    var zipBytes = buildStoreZip(entries);
    var zipName = "each_touch_12_sfx_starter_pack_cc0.zip";
    triggerDownload(zipBytes, zipName, "application/zip");
    setStatus("Exported " + zipName + " (12 WAVs + CC0 License, " + (zipBytes.length / 1024).toFixed(1) + " KB)");
  }

  function renderPresetGrid() {
    var grid = document.getElementById("preset-grid");
    if (!grid) return;
    grid.innerHTML = "";
    PRESETS.forEach(function (pr) {
      if (state.activePresetCatFilter !== "all" && pr.cat !== state.activePresetCatFilter) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-btn" + (pr.id === state.activePresetId ? " active" : "");
      btn.setAttribute("data-preset", pr.id);
      btn.innerHTML = "<strong>" + pr.name + "</strong><span>" + pr.tag + "</span>";
      btn.addEventListener("click", function () {
        applyPreset(pr.id, true);
      });
      grid.appendChild(btn);
    });
  }

  function renderRack() {
    var waveBox = document.getElementById("wave-pills");
    if (waveBox) {
      waveBox.innerHTML = "";
      WAVEFORMS.forEach(function (w) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "wave-pill" + (w.id === state.params.wave ? " active" : "");
        b.setAttribute("data-wave", w.id);
        b.textContent = w.label;
        b.addEventListener("click", function () {
          state.params.wave = w.id;
          var r = syncUiFromState();
          if (state.autoPlay) playCurrentBuffer(r);
        });
        waveBox.appendChild(b);
      });
    }

    var rack = document.getElementById("param-rack");
    if (!rack) return;
    rack.innerHTML = "";

    PARAM_GROUPS.forEach(function (g) {
      var groupEl = document.createElement("div");
      groupEl.className = "param-group" + (state.activeRackTab !== "all" && state.activeRackTab !== g.id ? " hidden" : "");
      groupEl.setAttribute("data-group", g.id);

      var titleEl = document.createElement("div");
      titleEl.className = "param-group-title";
      titleEl.textContent = g.title;
      groupEl.appendChild(titleEl);

      var grid = document.createElement("div");
      grid.className = "slider-grid";

      g.fields.forEach(function (f) {
        var cell = document.createElement("div");
        cell.className = "param-cell";

        var top = document.createElement("div");
        top.className = "param-label-row";
        var lbl = document.createElement("label");
        lbl.setAttribute("for", "param-" + f.key);
        lbl.textContent = f.label;
        var val = document.createElement("span");
        val.id = "val-" + f.key;
        val.className = "param-val mono";
        top.appendChild(lbl);
        top.appendChild(val);

        var input = document.createElement("input");
        input.type = "range";
        input.id = "param-" + f.key;
        input.min = String(f.min);
        input.max = String(f.max);
        input.step = String(f.step);
        input.value = String(state.params[f.key]);

        input.addEventListener("input", function () {
          state.params[f.key] = Number(input.value);
          syncUiFromState();
        });
        input.addEventListener("change", function () {
          if (state.autoPlay) {
            playCurrentBuffer(state.lastRender);
          }
        });

        cell.appendChild(top);
        cell.appendChild(input);
        grid.appendChild(cell);
      });

      groupEl.appendChild(grid);
      rack.appendChild(groupEl);
    });
  }

  function init() {
    renderPresetGrid();
    renderRack();

    // Preset filter tabs
    document.querySelectorAll("[data-cat-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.activePresetCatFilter = tab.getAttribute("data-cat-tab");
        document.querySelectorAll("[data-cat-tab]").forEach(function (t) {
          t.classList.toggle("active", t === tab);
        });
        renderPresetGrid();
      });
    });

    // Rack group tabs
    document.querySelectorAll("[data-rack-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.activeRackTab = tab.getAttribute("data-rack-tab");
        document.querySelectorAll("[data-rack-tab]").forEach(function (t) {
          t.classList.toggle("active", t === tab);
        });
        document.querySelectorAll(".param-group").forEach(function (g) {
          var gid = g.getAttribute("data-group");
          g.classList.toggle("hidden", state.activeRackTab !== "all" && state.activeRackTab !== gid);
        });
      });
    });

    var autoToggle = document.getElementById("toggle-autoplay");
    if (autoToggle) {
      autoToggle.checked = state.autoPlay;
      autoToggle.addEventListener("change", function () {
        state.autoPlay = autoToggle.checked;
      });
    }

    document.getElementById("btn-play").addEventListener("click", function () {
      var r = syncUiFromState();
      playCurrentBuffer(r);
    });
    document.getElementById("btn-mutate").addEventListener("click", function () {
      mutateCurrent(true);
    });
    document.getElementById("btn-random").addEventListener("click", function () {
      randomizeAll(true);
    });
    document.getElementById("btn-undo").addEventListener("click", function () {
      if (state.historyCursor + 1 < state.history.length) {
        state.historyCursor += 1;
        var prev = state.history[state.historyCursor];
        state.activePresetId = prev.presetId;
        state.params = Object.assign({}, prev.params);
        renderHistoryList();
        var r = syncUiFromState();
        playCurrentBuffer(r);
      }
    });

    document.getElementById("btn-export-wav").addEventListener("click", downloadSingleWav);
    document.getElementById("btn-export-var-zip").addEventListener("click", download8VariationsZip);
    document.getElementById("btn-export-pack-zip").addEventListener("click", downloadStarterPackZip);

    document.getElementById("btn-copy-json").addEventListener("click", function () {
      var txt = JSON.stringify(state.params, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () {
          setStatus("Copied synth preset JSON to clipboard.");
        }).catch(function () {
          setStatus("Preset seed #" + state.params.seed + " ready.");
        });
      } else {
        setStatus("Preset seed #" + state.params.seed + " ready.");
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", function (e) {
      var tag = e.target && e.target.tagName;
      if (tag === "INPUT" && e.target.type !== "range") return;
      if (e.code === "Space") {
        e.preventDefault();
        playCurrentBuffer(state.lastRender || syncUiFromState());
      } else if (e.key === "m" || e.key === "M") {
        mutateCurrent(true);
      } else if (e.key === "r" || e.key === "R") {
        randomizeAll(true);
      } else if (e.key === "s" || e.key === "S") {
        if (!e.metaKey && !e.ctrlKey) {
          downloadSingleWav();
        }
      }
    });

    window.addEventListener("resize", function () {
      if (state.lastRender) drawScope(state.lastRender);
    });

    pushHistory(PRESETS[0].name);
    syncUiFromState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
