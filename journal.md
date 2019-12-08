# Misc notes & thoughts.

---
## Day 8

I'm enjoying the real-life aspect of the stories this year: production systems with no documentation, gaps in organizational knowledge, mixed up specs, hard-to-understand requirements.

Today's reminds me of an concept, _Chesterton's Fence_, that I heard in one of my favorite podcasts yesterday.

> Unfortunately, images sent via the Digital Sending Network aren't encoded with any normal encoding; instead, they're encoded in a special Space Image Format. _None of the Elves seem to remember why this is the case._

- https://www.econtalk.org/rory-sutherland-on-alchemy/
- https://en.wikipedia.org/wiki/Wikipedia:Chesterton%27s_fence

I used my favorite character encoding reference site to get a more readable output on the terminal. Reversing black & white worked best.
- full block: https://graphemica.com/%E2%96%88
- light shade: https://graphemica.com/%E2%96%91

---
## Day 7


Too bad js doesn't have a convenient built-in range generator.
This seems to be a popular idiom:
- The first arg is an "array-like" object with a length property of 5.
- The second arg is a map function: we ignore the value and use the index.
```
// Generate range 0 .. 4.
const legalInputs = Array.from({length:5}, (_, i) => i);
```

...

One of my self-imposed rules for this contest, to increase learning opportunities, is to mostly avoid using modules. I'm also trying to avoid googling for algorithm suggestions. I broke down today though and followed https://en.wikipedia.org/wiki/Heap%27s_algorithm to generate my possible amplifier settings. I just didn't feel like wasting effort on a clunky implementation of the trivial part of the puzzle.

---
## Day 6

I spent a whole college semester learning clever ways to optimize this sort of thing for speed & memory. I feel like I should be somewhat ashamed of how many times I'm traversing this graph; on the other hand this was a quick and maintainable solution, and a tiny data set.

---
## Day 5

Hardest part today was interpreting the puzzle description for part 1.

---
## Day 4


Learned about array.prototype.some() today.

Yesterday I was struggling to get some basic info about substring, in a bad cell area on the train. I found Dash -- https://kapeli.com/dash -- and downloaded a bunch of docsets. They came in handy a couple of times today.

---
## Day 3

Lesson learned from last year: If I race through puzzle 1 trying to finish as fast as possible, I'm going to regret my lazy variable name choices and shortcuts. This year I'm not worrying about time, instead writing a little bit cleaner code, and so far the 2nd puzzles have been pretty easy.
