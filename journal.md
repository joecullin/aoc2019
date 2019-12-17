# Misc notes & thoughts.




---
## Day 12

I had fun trying to see how far I could get with brute force on part 2. Learned more about how much memory strings & booleans & arrays & sets use, learned about Uint8Array, learned about closures and garbage collection, wrote a little base-840 converter to get my array keys smaller, tried out levelup/leveldown, and then finally gave up and googled for a hint.

All the memory optimization stuff (trying different things and then comparing the actual memory usage via heap snapshots in chrome) actually gave me a couple ideas for an occasional problem that some of our users are seeing in a homegrown CMS app at work.


---
## Day 10

Made a cheesy visualization for this. It helped me get it right quickly (for example the couple of times I mixed up X & Y, or when I needed to re-orient my angles from 3:00 to noon.) And it was satisfying to watch the end result.

![Solution for part 2](/10/aoc_day10.gif)

---
## Day 9 

Part 1: I converted everything to use BigInt. I don't think I actually needed it, but it was interesting to try. Took me a while to find some small gotchas like `===` working differently than I expected, plus some silly mistakes on my part.

Part 2: Out-of-memory errors on my first try. Garbage collection is one of those things I only notice when it doesn't work well. I think I could have bumped the memory limit high enough with an env setting like `NODE_OPTIONS="--max_old_space_size=xxxx`, but I took the opportunity to learn more about memory troubleshooting in node. I set `NODE_OPTIONS=--inspect` and then took a few heap snapshots in chrome. It turned out my logger package was the culprit. I'm using a popular node module, winston, but it could be my custom format functions.

I had almost 9 million lines of output after a successful run.

I didn't dig into that further and try to improve my formatter functions. They haven't been that useful anyway. Switching all my logger.debug calls to console.debug drastically shrunk the memory usage. I think I'll go back to that for now.

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
