Chord Notation Practice
=====================


## Features

* Display chord notation, give feedback on whether or not it was input correctly
* Virtual keyboard
* MIDI input support
* Stats. Correct / Incorrect ratio, time taken to enter chord, keys that the user is most successful in, etc etc
* Chord display configuration: normie triads, inversions, 7ths + 9ths, key selection

## Notes

Web MIDI API spec - https://www.w3.org/TR/webmidi/
Firefox Implementation Tracker - https://bugzilla.mozilla.org/show_bug.cgi?id=836897

## Dev Journal

**1/8/2022**

I spent some time reading the MIDI spec and the MIDI api reference. Upon finding that firefox
does not yet support the MIDI api but that there are in-flight tickets to test compatibility as of
three (!!!) days ago, I almost distracted myself by seeing if I could pick Rust back up and contribute.
Instead, I switched to using chrome for local development. 

I got my repo all set up and set about getting a "hello world" for the MIDI api going. My first
hurdle was that my piano is about 20 feet away from my home computer, and I didn't want to run a giant
cable or work off my laptop and test with my physical piano. I needed to find a way to test locally
on my machine and emulate a piano connection. Something I had not considered was that this would be non-trivial;
a quote from the VPMK site: "To connect hardware MIDI devices you need physical MIDI cables. To connect MIDI software you need virtual cables." 
I tried a few different solutions but settled on using VMPK (Virtual Midi Piano Keyboard - https://vmpk.sourceforge.io/) and loopMIDI (https://www.tobias-erichsen.de/software/loopmidi.html).
Thank you Mr. Tobias Erichsen!

I fired up both pieces of software, configured VMPK to point to the port created by loopMIDI and voila, I could see a 
registered input in my console log of the MIDIAccess object returned by the MIDI api. 

**N+1**

My aim today is to explore the MIDI api now that my emulator is hooked up; what do notes / chords look like coming out 
of the piano. What would mapping a set of notes to a chord look like? I've also been thinking a little bit about the 
actual design of the "game" system itself; I think I am going to shoot for a pub / sub type of deal where components 
that care can register and receive notifications any time a music event is received. I hope this will let me write tests
without the emulator at all, and instead let me do things like "C2, E2, G2" received and map that to a C+ chord. It's 
tempting to look for some sort of package that can handle this mapping but I think I will learn more if I do it myself.

Alright after playing with the midi api type definitions, looks like it's all byte / int buffers coming out of the MIDI
events. I also learned that React renders at least twice by default in strict mode in an attempt to uncover issues, so I
am going to spend some time properly setting up all the hooks / update dependencies so that no longer happens since it's
causing the event listeners to the MIDI port to be added twice.

**1/10/2022**

I experimented with different styles of detecting what chords and notes are being played. I'm going
to try and have a "virtual" keyboard held in memory that updates based on the MIDI inputs, and any
components that care can just query that keyboard to see what is currently pressed. I think this will
make testing pretty convenient but there are lots of questions still to answer

**1/11/2022**

I presented the app idea to my teacher today. We ran through a bunch of examples of various chord
symbols and how they might be composed into small problems for a computer to solve. Given a chord
with a root note and a quality and a set of keys, can we determine if the keys are a valid voicing of the given chord?

Example:
Chord: C major
Keys: E2, G2, C3, E3

1. Remove duplicate notes 

        Keys: E2, G2, C3


2. Transpose any non-root notes to come after the lowest root note

       Keys: C3, E3, G3


4. Depending on the quality, calculate the required notes that should follow the root by interval
The quality is major, so we need a major third followed by a minor third, or 4 steps up the keyboard
followed by 3 steps.

       Required Keys: **C3** - C#3 - D3 - D#3 - **E3** - F3 - F#3 - **G3**

We have a match! This voicing is a valid representation of the Cmaj chord symbol. There are a lot
of edge cases to consider with more complicated versions of a chord symbol, for example something like 
"F -5/7 on C" (F major 7th flat five over C) but I'm gonna have future me figure that out.

**1/12/2022**

Reeee we have a bug! Sometimes the transposition of the active notes does not match the derived required
notes from the root. As an example, for F major:

      Active Keys: F5, A5, C6, F6

      Transposed and duplicated removed to match the octave of the lowest root note: F5, A5, **C5**

      Derived required notes: F5, A5, **C6**

For now, I am going to remove octave information all together and just compare the notes by themselves. This
wont last since in the future I would like a mode to enforce that the only way you cannot voice a chord symbol
is with the "standard" no-inversions or additions of a chord to hopefully influence the player to experiment.

**N+1**

During some reading about chord symbols, I found a wikipedia article that has a pretty interesting suggestion
for how to build out the Chord data structure. It suggests a chord is made of:

    1. the root note (e.g. C♯),
    2. the chord quality (e.g. minor or lowercase m, or the symbols o or + for diminished and augmented chords, respectively; chord quality is usually omitted for major chords),
    3. whether the chord is a triad, seventh chord, or an extended chord (e.g. Δ7),
    4. any altered notes (e.g. sharp five, or ♯5),
    5. any added tones (e.g. add2), and
    6. the bass note if it is not the root (e.g. a slash chord).

I have been wondering about how to deal with suspended chords or sevenths, but this seems like a fine framework
to go off of since it matches the domain anyway. DDD for the win!

1/14/2022

I got major and minor triads working just now. I was intending to continue on to getting 7ths to work
as well, but I think I'm going to pivot and get a rudimentary UI working. I want a bass
and treble cleff centered on the screen, and for the chord symbol to appear above it. The staff will
display the keys that the user is currently pressing, and there will be some sort of success indicator
once the user inputs the correct chord symbol. The staff should be a fun component to build, I'm looking
forward to that. 
